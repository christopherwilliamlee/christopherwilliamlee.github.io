---
layout: guia
title: Tutorial prático do bioBakery — MetaPhlAn 4 (Conda)
permalink: /guias/metaomicas/biobakery/
---

# <u>Perfil taxonômico com MetaPhlAn 4, a estrela do bioBakery</u>

<p style="align-text: justify">
  Fala, pessoal! Bora conhecer o
  <a href="https://github.com/biobakery" target="_blank">
    <span class="tooltip"><strong>bioBakery</strong>
      <span class="tooltiptext">Conjunto de ferramentas do Huttenhower Lab (Harvard) e do Segata Lab (Universidade de Trento) para análise de metagenomas.</span>
    </span>
  </a>?
  Ele não é uma ferramenta só, é uma "padaria" inteira 🥖: o <strong>KneadData</strong> limpa as reads (inclusive tirando o DNA do hospedeiro),
  o <strong>MetaPhlAn</strong> diz <em>quem</em> está na amostra, o <strong>HUMAnN</strong> diz <em>o que</em> eles estão fazendo (vias metabólicas)
  e o <strong>StrainPhlAn</strong> desce até o nível de linhagem.
</p>

<p>
  Neste guia a gente vai focar no
  <a href="https://github.com/biobakery/MetaPhlAn" target="_blank">
    <span class="tooltip"><strong>MetaPhlAn 4</strong>
      <span class="tooltiptext">Metagenomic Phylogenetic Analysis: estima a composição taxonômica usando genes marcadores específicos de cada clado.</span>
    </span>
  </a>.
  A diferença para o <a href="/guias/metaomicas/kraken2/">Kraken2</a> é a estratégia: em vez de olhar todos os k-mers de todos os genomas,
  o MetaPhlAn procura só
  <span class="tooltip"><strong>genes marcadores</strong>
    <span class="tooltiptext">Genes que existem em um único clado (espécie, gênero…) e em nenhum outro. Se a read bate nele, não tem dúvida de quem é.</span>
  </span>
  , milhões deles, organizados em
  <span class="tooltip"><strong>SGBs</strong>
    <span class="tooltiptext">Species-level Genome Bins: grupos de genomas da mesma espécie, inclusive de espécies que ainda nem têm nome (só conhecidas por metagenomas).</span>
  </span>.
  Resultado: menos falsos positivos e uma abundância relativa bem confiável.
</p>

<blockquote class="info">
Sobre "quem está na festa" e "o que eles estão fazendo", escrevi no Medium:
<a href="https://krakenomics.medium.com/-d81782e94e67" target="_blank">O que existe aqui?</a>
e
<a href="https://krakenomics.medium.com/%CC%83-4a8da3092a3c" target="_blank">O que eles estão fazendo?</a>.
</blockquote>

O que você vai precisar <u>antes</u>:

- **Conda** — [instalação aqui](/guias/ambientes/anaconda/)
- **WSL/Linux** — [tutorial aqui](/guias/plataforma/wsl/)
- **FASTQs limpos** — de preferência depois do trimming ([guia do Fastp](/guias/aparadores/fastp/), de onde este guia continua)
- **Máquina parruda** — a documentação oficial pede uns **30 GB de RAM** e o banco ocupa algumas dezenas de GB em disco

<blockquote class="warning">
Esse é o guia mais "pesado" da série. Num notebook comum (8–16 GB de RAM) o MetaPhlAn provavelmente não vai rodar.
Se você tem acesso a um servidor da universidade ou do laboratório, esse é o lugar certo para ele.
</blockquote>

Neste guia, <u>você vai</u>:

- Instalar o **MetaPhlAn 4** e baixar o banco de marcadores,
- Gerar o perfil taxonômico de uma amostra e entender a saída,
- Juntar várias amostras numa tabela só,
- Comparar o MetaPhlAn com o Kraken2.

<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2NzZnZ2enk2a3N5YnNkd2VlNTY4aTg4NzM0N2RqZWxkMzVuM2w1cyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/RGpTyXMjpTkIg/giphy.gif" alt="gif" width="300" style="display:block; margin:auto;">

---

## Passo a passo
1. [Preparação do ambiente](#preparacao-ambiente)
2. [Baixando o banco de marcadores](#banco)
3. [Rodando o MetaPhlAn](#rodando)
4. [Entendendo a saída](#saida)
5. [Várias amostras e tabela única](#varias-amostras)
6. [MetaPhlAn ou Kraken2?](#comparacao)
7. [E o HUMAnN?](#humann)

---

<h2 id="preparacao-ambiente">1. Preparação do ambiente</h2>

<pre>
conda create -n mpa -c conda-forge -c bioconda "metaphlan>=4.2" -y
conda activate mpa
</pre>

<blockquote class="info">
<strong>mpa</strong> é o nome que a gente deu pro ambiente (vem de <em>MetaPhlAn</em>, e é o mesmo nome que a documentação oficial usa).
O Conda já instala junto o <code>bowtie2</code>, que o MetaPhlAn usa para alinhar as reads nos marcadores.
</blockquote>

Confira a versão:

<pre>
metaphlan --version
</pre>

---

<h2 id="banco">2. Baixando o banco de marcadores</h2>

Crie uma pasta para os bancos (a mesma ideia do guia do Kraken2) e baixe o banco mais recente:

<pre>
mkdir -p ~/bases/metaphlan
metaphlan --install --db_dir ~/bases/metaphlan --nproc 4
</pre>

<blockquote class="tip">
O <code>--install</code> baixa sozinho a versão mais nova do banco (no momento em que escrevi este guia, a <code>vJan25</code>)
e já monta o índice do bowtie2. Demora um pouco, então é outra hora boa pra um café ☕.
</blockquote>

<blockquote class="warning">
<strong>Guarde a versão do banco!</strong> Perfis gerados com bancos diferentes <u>não podem</u> ser comparados nem juntados
na mesma tabela. Se for analisar amostras em momentos diferentes, use sempre o mesmo banco. Para conferir qual você tem:
<pre>ls ~/bases/metaphlan</pre>
</blockquote>

---

<h2 id="rodando">3. Rodando o MetaPhlAn</h2>

Volte para a pasta do projeto do [guia do Fastp](/guias/aparadores/fastp/) e crie uma pasta para os resultados:

<pre>
cd ~/analise_dados/aula_1
mkdir -p metaphlan
</pre>

<blockquote class="info">
Não fez o guia do Fastp? Use <strong><u>seus próprios FASTQs</u></strong> ou baixe dados públicos com o
<a href="/guias/ferramentas/sra_tools/" target="_blank">SRA-Tools</a>. Só troque os nomes dos arquivos.
</blockquote>

Agora rode o MetaPhlAn. Repare que o R1 e o R2 vão juntos, separados por <strong>vírgula</strong>:

<pre>
metaphlan \
  pos_trim/meta_aula_trim_1_L001_R1_001.fastq.gz,pos_trim/meta_aula_trim_1_L001_R2_001.fastq.gz \
  --input_type fastq \
  --db_dir ~/bases/metaphlan \
  --mapout metaphlan/meta_aula_1.mapout.bz2 \
  --nproc 4 \
  -o metaphlan/meta_aula_1_perfil.txt
</pre>

### Principais parâmetros:

<div class="table-wrap">
  <table>
    <thead>
      <tr>
        <th>Parâmetro</th>
        <th>Descrição</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>--input_type fastq</code></td>
        <td>Tipo de entrada (<code>fastq</code>, <code>mapout</code> ou <code>sam</code>).</td>
      </tr>
      <tr>
        <td><code>--db_dir</code></td>
        <td>Pasta onde está o banco de marcadores.</td>
      </tr>
      <tr>
        <td><code>--mapout</code></td>
        <td>Salva o alinhamento das reads nos marcadores. <strong>Guarde esse arquivo!</strong></td>
      </tr>
      <tr>
        <td><code>--nproc 4</code></td>
        <td>Número de núcleos do processador.</td>
      </tr>
      <tr>
        <td><code>-o</code></td>
        <td>Arquivo com o perfil taxonômico.</td>
      </tr>
    </tbody>
  </table>
</div>

<blockquote class="tip">
Por que guardar o <code>.mapout.bz2</code>? Porque a parte demorada é o alinhamento. Se depois você quiser rodar de novo com
outro parâmetro, dá pra partir dele e o MetaPhlAn termina em segundos:
<pre>
metaphlan metaphlan/meta_aula_1.mapout.bz2 --input_type mapout --db_dir ~/bases/metaphlan -o metaphlan/meta_aula_1_perfil_v2.txt
</pre>
</blockquote>

<blockquote class="info">
Usou <strong>Oxford Nanopore</strong> ou <strong>PacBio</strong>? A partir da versão 4.2 o MetaPhlAn aceita reads longas, é só adicionar
<code>--long_reads</code> (ele passa a usar o <code>minimap2</code> no lugar do bowtie2).
Ficou em dúvida sobre reads longas x curtas? Escrevi sobre isso no
<a href="https://krakenomics.medium.com/long-reads-vs-short-reads-o-dilema-do-tamanho-no-ngs-aec1b4078293" target="_blank">Medium</a>.
</blockquote>

---

<h2 id="saida">4. Entendendo a saída</h2>

Dê uma olhada no começo do arquivo:

<pre>
head -20 metaphlan/meta_aula_1_perfil.txt
</pre>

<p>
  As primeiras linhas (com <code>#</code>) dizem a versão do banco e quantas reads foram processadas. Depois vem a tabela:
</p>

<div class="table-wrap">
  <table>
    <thead>
      <tr>
        <th>Coluna</th>
        <th>O que significa</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>clade_name</code></td>
        <td>A linhagem completa: <code>k__</code> reino, <code>p__</code> filo, <code>c__</code> classe, <code>o__</code> ordem, <code>f__</code> família, <code>g__</code> gênero, <code>s__</code> espécie e <code>t__</code> SGB.</td>
      </tr>
      <tr>
        <td><code>NCBI_tax_id</code></td>
        <td>Os TaxIDs do NCBI de cada nível.</td>
      </tr>
      <tr>
        <td><code>relative_abundance</code></td>
        <td>Abundância relativa em % (soma 100 em cada nível).</td>
      </tr>
      <tr>
        <td><code>additional_species</code></td>
        <td>Outras espécies que caem no mesmo SGB.</td>
      </tr>
    </tbody>
  </table>
</div>

Quer só as espécies, sem a linhagem gigante? Rode:

<pre>
grep "s__" metaphlan/meta_aula_1_perfil.txt | grep -v "t__" | \
  awk -F'\t' '{n=split($1,a,"|"); print a[n]"\t"$3}' | sort -t$'\t' -k2,2gr | head -10
</pre>

<blockquote class="info">
Vai aparecer uma linha <code>UNCLASSIFIED</code>. É a fração estimada da amostra que não bateu em nenhum marcador
(organismos que não estão no banco, DNA do hospedeiro…). Se ela for muito alta, vale checar se a amostra tem muito DNA humano.
O <strong>KneadData</strong>, do próprio bioBakery, remove essas reads antes do MetaPhlAn.
</blockquote>

<blockquote class="warning">
Atenção: a abundância do MetaPhlAn é de <strong>organismos</strong> (corrigida pelo tamanho dos genomas), e não de reads.
Por isso os números não batem diretamente com os do Kraken2/Bracken, e tá tudo bem!
</blockquote>

---

<h2 id="varias-amostras">5. Várias amostras e tabela única</h2>

Rode um loop para todas as amostras da pasta <code>pos_trim/</code>:

<pre>
for r1 in pos_trim/*_R1_001.fastq.gz; do
  r2=${r1/_R1_/_R2_}
  amostra=$(basename "$r1" _R1_001.fastq.gz)

  metaphlan "$r1","$r2" --input_type fastq --db_dir ~/bases/metaphlan \
    --mapout metaphlan/${amostra}.mapout.bz2 --nproc 4 \
    -o metaphlan/${amostra}_perfil.txt
done
</pre>

Depois junte tudo, com uma coluna por amostra:

<pre>
merge_metaphlan_tables.py metaphlan/*_perfil.txt > metaphlan/abundancia_todas.txt
</pre>

E separe só o nível de espécie (mantendo o cabeçalho), pronto para levar pro R ou Python:

<pre>
grep -E "clade_name|s__" metaphlan/abundancia_todas.txt | grep -v "t__" > metaphlan/especies_todas.txt
</pre>

---

<h2 id="comparacao">6. MetaPhlAn ou Kraken2?</h2>

<p>Pergunta clássica! Não existe "o melhor": cada um tem seu ponto forte.</p>

<div class="table-wrap">
  <table>
    <thead>
      <tr>
        <th></th>
        <th>Kraken2 + Bracken</th>
        <th>MetaPhlAn 4</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Estratégia</strong></td>
        <td>k-mers de genomas inteiros</td>
        <td>Genes marcadores específicos de clado</td>
      </tr>
      <tr>
        <td><strong>Velocidade</strong></td>
        <td>Muito rápido ⚡</td>
        <td>Mais lento (alinha com bowtie2)</td>
      </tr>
      <tr>
        <td><strong>Memória</strong></td>
        <td>Dá pra rodar com 8 GB (banco Standard-8)</td>
        <td>Precisa de bem mais RAM</td>
      </tr>
      <tr>
        <td><strong>Falsos positivos</strong></td>
        <td>Mais comuns (use <code>--confidence</code> e filtros)</td>
        <td>Raros</td>
      </tr>
      <tr>
        <td><strong>Abundância</strong></td>
        <td>De reads</td>
        <td>De organismos</td>
      </tr>
      <tr>
        <td><strong>Espécies sem nome</strong></td>
        <td>Só o que está no banco (RefSeq)</td>
        <td>Sim, via SGBs de metagenomas</td>
      </tr>
    </tbody>
  </table>
</div>

<blockquote class="tip">
Na dúvida, rode os dois! As espécies que aparecem nos dois com abundância parecida são as que você pode afirmar com mais segurança.
</blockquote>

---

<h2 id="humann">7. E o HUMAnN?</h2>

<p>
  O <a href="https://github.com/biobakery/humann" target="_blank">HUMAnN</a> é o próximo passo natural: ele usa o perfil do MetaPhlAn para
  descobrir quais <strong>genes e vias metabólicas</strong> estão presentes na comunidade.
</p>

<blockquote class="warning">
Quando escrevi este guia, o <strong>HUMAnN 4</strong> ainda estava em versão <em>alpha</em> e funcionava só com o MetaPhlAn até a versão 4.1.1
(com o banco <code>mpa_vOct22_CHOCOPhlAnSGB_202403</code>), e não com o 4.2 que a gente instalou aqui. Por isso ele vai ganhar um guia
próprio, num ambiente separado. Enquanto isso, acompanhe as novidades no
<a href="https://forum.biobakery.org/" target="_blank">fórum do bioBakery</a>.
</blockquote>

---

# Conclusão

Você gerou o <strong>perfil taxonômico</strong> de metagenomas com o MetaPhlAn 4:

- Instalação e download do banco de marcadores
- Perfil de uma amostra e leitura da saída
- Loop para várias amostras e tabela única com <code>merge_metaphlan_tables.py</code>
- E ainda sabe quando usar MetaPhlAn ou Kraken2

Até a próxima!

<img src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3d3g1YzYwenJyM3UwdGIyZmlwNm5rcXV4aG5qaWY1bXo0c3g0bXRvNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/VkpfO6W4D7yB7vSjXy/giphy.gif" alt="gif" width="300" style="display:block; margin:auto;">

---

## Desafio!!!

Rode o <a href="/guias/metaomicas/kraken2/">Kraken2 + Bracken</a> e o MetaPhlAn na <strong>mesma amostra</strong> e compare o top 10 de espécies.
Quantas aparecem nos dois? Quais só aparecem no Kraken2?<br>
Bônus: coloque os dois num <a href="/guias/ambientes/nextflow/" target="_blank">**pipeline Nextflow**</a> e rode tudo com um comando só.<br>
Até a próxima!

---

Dê um suporte ao meu projeto. Doe um cafézinho ☕.<br>
Pix: biologolee@gmail.com<br>
Bitcoin: bc1qg7qrfhclzt3sm60en53qv8fmwpuacfaxt5v55k

![QR Code](/assets/img/meus_projetos/bluewallet_qrcode.png)

---

# Referências

1. <a href="https://github.com/biobakery/biobakery" target="_blank">bioBakery — página oficial no GitHub</a>
2. <a href="https://github.com/biobakery/MetaPhlAn" target="_blank">MetaPhlAn — repositório oficial</a>
3. <a href="https://github.com/biobakery/MetaPhlAn/wiki/MetaPhlAn-4.2" target="_blank">MetaPhlAn 4.2 — wiki oficial</a>
4. <a href="https://www.nature.com/articles/s41587-023-01688-w" target="_blank">Extending and improving metagenomic taxonomic profiling with uncharacterized species using MetaPhlAn 4 (Nature Biotechnology, 2023)</a>
5. <a href="https://bioconda.github.io/recipes/metaphlan/README.html" target="_blank">Pacote MetaPhlAn no Bioconda</a>
6. <a href="https://elifesciences.org/articles/65088" target="_blank">Integrating taxonomic, functional, and strain-level profiling of diverse microbial communities with bioBakery 3 (eLife, 2021)</a>
7. <a href="https://forum.biobakery.org/" target="_blank">Fórum do bioBakery</a>
