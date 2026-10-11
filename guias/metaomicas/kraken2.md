---
layout: guia
title: Tutorial prático do Kraken2 + Bracken (Conda)
permalink: /guias/metaomicas/kraken2/
---

![Fastp logo](/assets/img/kraken2/kraken_logo.jpg)

# <u>Quem está na sua amostra? Classificação taxonômica com Kraken2, Bracken e Krona</u>

<p style="align-text: justify">
  Fala, pessoal! Bora falar do
  <a href="https://github.com/DerrickWood/kraken2" target="_blank">
    <span class="tooltip"><strong>Kraken2</strong>
      <span class="tooltiptext">Classificador taxonômico de reads baseado em k-mers, muito usado em metagenômica shotgun.</span>
    </span>
  </a>?
  Esse é o queridinho da casa (não é à toa que meu Medium se chama <em>Krakenomics</em> 😅).<br>
  Depois que você limpou os seus FASTQs, a pergunta que todo mundo quer responder é:
  <strong>quem está na festa?</strong> Quais bactérias, fungos e vírus estão na sua amostra, e em que proporção?<br>
  O Kraken2 responde isso de um jeito muito rápido. Ele quebra cada read em pedacinhos chamados
  <span class="tooltip"><strong>k-mers</strong>
    <span class="tooltiptext">Subsequências de tamanho k (ex.: 35 bases) extraídas de uma sequência maior.</span>
  </span>,
  procura esses pedacinhos em um
  <span class="tooltip"><strong>banco de dados</strong>
    <span class="tooltiptext">Índice construído a partir de genomas de referência (RefSeq) com a taxonomia do NCBI.</span>
  </span>
  e, quando um k-mer aparece em vários organismos, ele usa o
  <span class="tooltip"><strong>LCA</strong>
    <span class="tooltiptext">Lowest Common Ancestor: o ancestral comum mais baixo na árvore taxonômica entre os organismos que compartilham aquele k-mer.</span>
  </span>
  para decidir onde classificar a read.
</p>

<p>
  Só que o Kraken2 sozinho tem um porém: muitas reads ficam "presas" em níveis mais altos (gênero, família),
  porque o k-mer é compartilhado por várias espécies. Aí entra o
  <a href="https://github.com/jenniferlu717/Bracken" target="_blank">
    <span class="tooltip"><strong>Bracken</strong>
      <span class="tooltiptext">Bayesian Reestimation of Abundance with KrakEN: redistribui as reads para o nível de espécie e estima a abundância.</span>
    </span>
  </a>,
  que redistribui essas reads e estima a <strong>abundância</strong> de cada espécie. E pra fechar com chave de ouro,
  o <strong>Krona</strong> transforma tudo num gráfico interativo lindo em HTML.
</p>

<blockquote class="info">
Ainda está confuso com metagenômica, metataxonomia e metabarcoding? Escrevi sobre isso no Medium:
<a href="https://krakenomics.medium.com/quem-est%C3%A1-na-festa-metataxonomia-metabarcoding-e-metagen%C3%B4mica-explicados-sem-mist%C3%A9rio-95bd5dcd1582" target="_blank">Quem está na festa?</a>
e
<a href="https://krakenomics.medium.com/-d81782e94e67" target="_blank">O que existe aqui?</a>.
</blockquote>

O que você vai precisar <u>antes</u>:

- **Conda** — [instalação aqui](/guias/ambientes/anaconda/)
- **WSL/Linux** — [tutorial aqui](/guias/plataforma/wsl/)
- **FASTQs limpos** — de preferência depois do trimming. Se ainda não fez, siga o [guia do Fastp](/guias/aparadores/fastp/) (é exatamente de onde este guia continua)
- **Memória e espaço em disco** — uns **8 GB de RAM livres** e **~15 GB de disco** para o banco de dados

Neste guia, <u>você vai</u>:

- Criar um ambiente Conda com **Kraken2**, **Bracken**, **KrakenTools** e **Krona**,
- Baixar um banco de dados pronto (sem precisar construir nada!),
- Classificar as reads, entender o relatório e estimar a abundância por espécie,
- Gerar um gráfico interativo e rodar tudo para várias amostras de uma vez.

<img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExczc4aXRnMTM0cHZ5azdnYXYzYmRmaDd2aWUzczlvejdzZnM1NGthbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BUr2bF47czHJTpEuZs/giphy.gif" alt="gif" width="300" style="display:block; margin:auto;">

---

## Passo a passo
1. [Preparação do ambiente](#preparacao-ambiente)
2. [Baixando o banco de dados](#banco-dados)
3. [Classificando as reads com Kraken2](#classificacao)
4. [Entendendo o relatório (kreport)](#kreport)
5. [Estimando a abundância com Bracken](#bracken)
6. [Visualizando com Krona](#krona)
7. [Rodando várias amostras de uma vez](#varias-amostras)

---

<h2 id="preparacao-ambiente">1. Preparação do ambiente</h2>

Crie um ambiente com tudo que a gente vai usar:

<pre>
conda create -n kraken2 -c bioconda -c conda-forge kraken2 bracken krakentools krona -y
conda activate kraken2
</pre>

<blockquote class="info">
<strong>kraken2</strong> é o nome do ambiente. Dentro dele você terá:<br>
• <code>kraken2</code> — a classificação em si,<br>
• <code>bracken</code> — a reestimativa de abundância,<br>
• <code>krakentools</code> — scripts úteis (a gente vai usar o <code>kreport2krona.py</code>),<br>
• <code>krona</code> — os gráficos interativos (<code>ktImportText</code>).
</blockquote>

Confirme se está tudo funcionando:

<pre>
kraken2 --version
bracken -v
</pre>

---

<h2 id="banco-dados">2. Baixando o banco de dados</h2>

<p>
  O Kraken2 precisa de um banco de dados. Você até pode construir o seu, mas isso leva horas e precisa de muita memória.
  A boa notícia é que o pessoal do <a href="https://benlangmead.github.io/aws-indexes/k2" target="_blank">Ben Langmead</a>
  disponibiliza bancos prontos e atualizados. Para começar, o melhor custo-benefício é o
  <span class="tooltip"><strong>Standard-8</strong>
    <span class="tooltiptext">Banco "Standard" (arqueias, bactérias, vírus, plasmídeos, humano e UniVec_Core) limitado a 8 GB.</span>
  </span>,
  que cabe em computadores comuns.
</p>

<div class="table-wrap">
  <table>
    <thead>
      <tr>
        <th>Banco</th>
        <th>Download</th>
        <th>Tamanho final</th>
        <th>Quando usar</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>Standard-8</code></td>
        <td>5,5 GB</td>
        <td>7,5 GB</td>
        <td>Notebook/WSL, aulas, primeiros testes.</td>
      </tr>
      <tr>
        <td><code>Standard-16</code></td>
        <td>11,2 GB</td>
        <td>14,9 GB</td>
        <td>Mais sensibilidade, se você tiver ~16 GB de RAM.</td>
      </tr>
      <tr>
        <td><code>PlusPF-8</code></td>
        <td>—</td>
        <td>~8 GB</td>
        <td>Quando você também quer <strong>protozoários e fungos</strong>.</td>
      </tr>
    </tbody>
  </table>
</div>

Crie uma pasta para guardar os bancos (fora da pasta do projeto, assim você reaproveita em outras análises) e baixe o Standard-8:

<pre>
mkdir -p ~/bases/kraken2/k2_standard_08
cd ~/bases/kraken2

wget https://genome-idx.s3.amazonaws.com/kraken/k2_standard_08_GB_20260626.tar.gz
tar -xvzf k2_standard_08_GB_20260626.tar.gz -C k2_standard_08
rm k2_standard_08_GB_20260626.tar.gz
</pre>

<blockquote class="tip">
A data no nome do arquivo (<code>20260626</code>) é a versão do banco. Eles atualizam algumas vezes por ano:
confira a versão mais nova na <a href="https://benlangmead.github.io/aws-indexes/k2" target="_blank">página dos índices</a>
e troque a data no comando.
</blockquote>

Confira se os arquivos principais estão lá:

<pre>
ls ~/bases/kraken2/k2_standard_08
</pre>

<p>
  Você deve ver pelo menos <code>hash.k2d</code>, <code>opts.k2d</code> e <code>taxo.k2d</code> (esses são o banco do Kraken2) e
  vários arquivos <code>database*mers.kmer_distrib</code> (esses são do Bracken, guarda essa informação aí!).
</p>

Para não ter que digitar o caminho toda hora, salve numa variável:

<pre>
export K2DB=~/bases/kraken2/k2_standard_08
</pre>

<blockquote class="warning">
Está no <strong>WSL</strong>? Por padrão ele usa só metade da RAM do Windows. Se o Kraken2 for "morto" sem explicação
(<code>Killed</code>), aumente a memória do WSL criando o arquivo <code>C:\Users\SEU_USUARIO\.wslconfig</code> com:
<pre>
[wsl2]
memory=10GB
</pre>
Depois rode <code>wsl --shutdown</code> no PowerShell e abra o terminal de novo.
</blockquote>

---

<h2 id="classificacao">3. Classificando as reads com Kraken2</h2>

Volte para a pasta do projeto que a gente montou no [guia do Fastp](/guias/aparadores/fastp/) e crie uma pasta para os resultados:

<pre>
cd ~/analise_dados/aula_1
mkdir -p kraken2
</pre>

<blockquote class="info">
Não fez o guia do Fastp? Sem problema! Use <strong><u>seus próprios FASTQs</u></strong> ou baixe dados públicos com o
<a href="/guias/ferramentas/sra_tools/" target="_blank">SRA-Tools</a>. Só troque os nomes dos arquivos nos comandos abaixo.
</blockquote>

Agora rode o Kraken2 nas reads limpas (paired-end):

<pre>
kraken2 \
  --db $K2DB \
  --threads 4 \
  --paired \
  --gzip-compressed \
  --confidence 0.1 \
  --report kraken2/meta_aula_1.kreport \
  --output kraken2/meta_aula_1.kraken \
  pos_trim/meta_aula_trim_1_L001_R1_001.fastq.gz \
  pos_trim/meta_aula_trim_1_L001_R2_001.fastq.gz
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
        <td><code>--db</code></td>
        <td>Pasta do banco de dados (a variável <code>$K2DB</code>).</td>
      </tr>
      <tr>
        <td><code>--threads 4</code></td>
        <td>Número de núcleos do processador usados.</td>
      </tr>
      <tr>
        <td><code>--paired</code></td>
        <td>Avisa que são dois arquivos (R1 e R2) do mesmo fragmento.</td>
      </tr>
      <tr>
        <td><code>--gzip-compressed</code></td>
        <td>Os FASTQs estão compactados (<code>.gz</code>).</td>
      </tr>
      <tr>
        <td><code>--confidence 0.1</code></td>
        <td>Exige que pelo menos 10% dos k-mers concordem com a classificação. Reduz falsos positivos (o padrão é 0).</td>
      </tr>
      <tr>
        <td><code>--report</code></td>
        <td>Relatório resumido por táxon (o arquivo mais importante!).</td>
      </tr>
      <tr>
        <td><code>--output</code></td>
        <td>Classificação de cada read, uma por linha (pode ficar grande).</td>
      </tr>
    </tbody>
  </table>
</div>

No final, o Kraken2 mostra um resumo parecido com este:

<pre>
Loading database information... done.
123456 sequences (61.73 Mbp) processed in 4.512s (1642.0 Kseq/m, 820.81 Mbp/m).
  98765 sequences classified (80.00%)
  24691 sequences unclassified (20.00%)
</pre>

<blockquote class="tip">
Computador com pouca RAM? Adicione <code>--memory-mapping</code>. O Kraken2 passa a ler o banco direto do disco em vez de
carregar tudo na memória. Fica mais lento, mas funciona.
</blockquote>

<blockquote class="info">
Se você não vai usar a classificação read a read, pode economizar espaço com <code>--output /dev/null</code>.
O <code>--report</code> é o que a gente usa daqui pra frente.
</blockquote>

---

<h2 id="kreport">4. Entendendo o relatório (kreport)</h2>

O arquivo <code>.kreport</code> é uma tabela com seis colunas:

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
        <td>1</td>
        <td>% das reads naquele táxon <strong>e em tudo abaixo dele</strong> (clado).</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Número de reads no clado.</td>
      </tr>
      <tr>
        <td>3</td>
        <td>Número de reads atribuídas <strong>diretamente</strong> àquele táxon.</td>
      </tr>
      <tr>
        <td>4</td>
        <td>Nível taxonômico: <code>U</code> (não classificado), <code>D</code> (domínio), <code>P</code>, <code>C</code>, <code>O</code>, <code>F</code>, <code>G</code>, <code>S</code> (espécie)…</td>
      </tr>
      <tr>
        <td>5</td>
        <td>TaxID do NCBI.</td>
      </tr>
      <tr>
        <td>6</td>
        <td>Nome científico (a indentação mostra a hierarquia).</td>
      </tr>
    </tbody>
  </table>
</div>

Quer ver as 10 espécies com mais reads? Rode:

<pre>
awk -F'\t' '$4=="S"' kraken2/meta_aula_1.kreport | sort -t$'\t' -k2,2nr | head -10
</pre>

<blockquote class="warning">
Cuidado com espécies que aparecem com pouquíssimas reads (tipo 1 a 10). Elas podem ser
<span class="tooltip"><strong>falsos positivos</strong>
  <span class="tooltiptext">Classificações erradas causadas por k-mers compartilhados, contaminação ou limitações do banco.</span>
</span>.
Antes de sair escrevendo no artigo que achou um patógeno raro, confira com outra ferramenta (ex.: <a href="/guias/metaomicas/biobakery/">MetaPhlAn</a>).
</blockquote>

---

<h2 id="bracken">5. Estimando a abundância com Bracken</h2>

<p>
  Lembra dos arquivos <code>database*mers.kmer_distrib</code> que vieram com o banco? O número no nome é o
  <strong>tamanho de read</strong> para o qual aquele arquivo foi calculado. Escolha o mais próximo do tamanho das suas reads:
</p>

<pre>
ls $K2DB/*kmer_distrib
</pre>

Agora rode o Bracken no nível de espécie:

<pre>
bracken \
  -d $K2DB \
  -i kraken2/meta_aula_1.kreport \
  -o kraken2/meta_aula_1.bracken \
  -w kraken2/meta_aula_1_bracken.kreport \
  -r 150 \
  -l S \
  -t 10
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
        <td><code>-i</code></td>
        <td>O <code>.kreport</code> gerado pelo Kraken2.</td>
      </tr>
      <tr>
        <td><code>-o</code></td>
        <td>Tabela de abundância (uma linha por espécie).</td>
      </tr>
      <tr>
        <td><code>-w</code></td>
        <td>Um novo kreport, já com as reads redistribuídas (a gente usa no Krona).</td>
      </tr>
      <tr>
        <td><code>-r 150</code></td>
        <td>Tamanho das reads (tem que existir o <code>database150mers.kmer_distrib</code>).</td>
      </tr>
      <tr>
        <td><code>-l S</code></td>
        <td>Nível taxonômico: <code>S</code> espécie, <code>G</code> gênero, <code>F</code> família…</td>
      </tr>
      <tr>
        <td><code>-t 10</code></td>
        <td>Ignora táxons com menos de 10 reads (ajuda a cortar ruído).</td>
      </tr>
    </tbody>
  </table>
</div>

Abra a tabela e ordene pela abundância (última coluna, <code>fraction_total_reads</code>):

<pre>
sort -t$'\t' -k7,7gr kraken2/meta_aula_1.bracken | head -10 | column -t -s$'\t'
</pre>

<blockquote class="info">
Não sabe o tamanho das suas reads? Olhe o relatório do Fastp ou do FastQC (<em>Sequence length</em>), ou rode:
<pre>zcat pos_trim/meta_aula_trim_1_L001_R1_001.fastq.gz | head -400 | awk 'NR%4==2{print length($0)}' | sort -n | uniq -c | tail -3</pre>
</blockquote>

---

<h2 id="krona">6. Visualizando com Krona</h2>

Agora a parte bonita! Converta o kreport do Bracken para o formato do Krona e gere o HTML:

<pre>
kreport2krona.py -r kraken2/meta_aula_1_bracken.kreport -o kraken2/meta_aula_1.krona.txt
ktImportText kraken2/meta_aula_1.krona.txt -o kraken2/meta_aula_1.krona.html
</pre>

<blockquote class="tip">
Abra o <code>meta_aula_1.krona.html</code> no navegador. Dá pra clicar em cada fatia e ir descendo de filo até espécie.
No Windows, ache o arquivo pelo <strong>File Explorer → Linux</strong>, seguindo o caminho mostrado pelo <code>pwd</code>
(igual fizemos no <a href="/guias/qualidade/fastqc/" target="_blank">guia do FastQC</a>).
</blockquote>

---

<h2 id="varias-amostras">7. Rodando várias amostras de uma vez</h2>

<p>
  Na vida real você não tem uma amostra só, né? Use um <strong>loop</strong> para rodar tudo de uma vez.
  Esse exemplo pega todos os R1 da pasta <code>pos_trim/</code> e descobre o R2 sozinho:
</p>

<pre>
for r1 in pos_trim/*_R1_001.fastq.gz; do
  r2=${r1/_R1_/_R2_}
  amostra=$(basename "$r1" _R1_001.fastq.gz)

  kraken2 --db $K2DB --threads 4 --paired --gzip-compressed --confidence 0.1 \
    --report kraken2/${amostra}.kreport --output /dev/null "$r1" "$r2"

  bracken -d $K2DB -i kraken2/${amostra}.kreport -o kraken2/${amostra}.bracken \
    -w kraken2/${amostra}_bracken.kreport -r 150 -l S -t 10
done
</pre>

E depois junte tudo numa tabela só, com uma coluna por amostra:

<pre>
combine_bracken_outputs.py --files kraken2/*.bracken -o kraken2/abundancia_todas.tsv
</pre>

<blockquote class="tip">
O Krona também aceita várias amostras de uma vez, e cada uma vira uma "aba" no mesmo HTML:
<pre>ktImportText kraken2/*.krona.txt -o kraken2/todas.krona.html</pre>
(rode o <code>kreport2krona.py</code> para cada amostra antes).
</blockquote>

---

# Conclusão

Você montou um fluxo completo de <strong>classificação taxonômica</strong> para metagenômica shotgun:

- Classificação das reads com Kraken2
- Reestimativa de abundância por espécie com Bracken
- Visualização interativa com Krona
- Tudo em loop, para quantas amostras você quiser

Com a tabela <code>abundancia_todas.tsv</code> em mãos, dá pra partir para o R ou Python e calcular diversidade alfa e beta, fazer gráficos de barras empilhadas e comparar grupos.

Até a próxima!

<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExa3Nldzd5aHNteXpnOHE2a2hvdXR0Z3pzNjl2MjJ3NHIwM3F5bHVzbSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/fWfowxJtHySJ0SGCgN/giphy.gif" alt="gif" width="300" style="display:block; margin:auto;">

---

## Desafio!!!

Sabia que o <a href="/guias/qualidade/multiqc/" target="_blank">MultiQC</a> também lê os relatórios do Kraken2?
Rode <code>multiqc .</code> na pasta do projeto e veja o Fastp, o Falco e o Kraken2 no mesmo relatório.<br>
E se você colocar tudo isso dentro de um <a href="/guias/ambientes/snakemake/" target="_blank">**Snakefile**</a> ou de um
<a href="/guias/ambientes/nextflow/" target="_blank">**pipeline Nextflow**</a>? Do FASTQ bruto ao Krona com um comando só!<br>
Até a próxima!

---

Dê um suporte ao meu projeto. Doe um cafézinho ☕.<br>
Pix: biologolee@gmail.com<br>
Bitcoin: bc1qg7qrfhclzt3sm60en53qv8fmwpuacfaxt5v55k

![QR Code](/assets/img/meus_projetos/bluewallet_qrcode.png)

---

# Referências

1. <a href="https://github.com/DerrickWood/kraken2" target="_blank">Kraken2 — repositório oficial</a>
2. <a href="https://github.com/DerrickWood/kraken2/wiki/Manual" target="_blank">Manual do Kraken2</a>
3. <a href="https://genomebiology.biomedcentral.com/articles/10.1186/s13059-019-1891-0" target="_blank">Improved metagenomic analysis with Kraken 2 (Genome Biology, 2019)</a>
4. <a href="https://benlangmead.github.io/aws-indexes/k2" target="_blank">Bancos pré-construídos do Kraken2/Bracken</a>
5. <a href="https://github.com/jenniferlu717/Bracken" target="_blank">Bracken — repositório oficial</a>
6. <a href="https://peerj.com/articles/cs-104/" target="_blank">Bracken: estimating species abundance in metagenomics data (PeerJ Computer Science, 2017)</a>
7. <a href="https://github.com/jenniferlu717/KrakenTools" target="_blank">KrakenTools</a>
8. <a href="https://github.com/marbl/Krona" target="_blank">Krona — repositório oficial</a>
9. <a href="https://www.nature.com/articles/s41596-022-00738-y" target="_blank">Metagenome analysis using the Kraken software suite (Nature Protocols, 2022)</a>
