---
layout: guia
title: Tutorial prático do QIIME 2 (16S, Conda)
permalink: /guias/metaomicas/qiime2/
---

![Fastp logo](/assets/img/qiime2/qiime2_logo.png)

# <u>Metabarcoding com QIIME 2: das reads ao gráfico de diversidade</u>

<p style="align-text: justify">
  Fala, pessoal! Bora falar do
  <a href="https://qiime2.org/" target="_blank">
    <span class="tooltip"><strong>QIIME 2</strong>
      <span class="tooltiptext">Quantitative Insights Into Microbial Ecology: plataforma para análise de microbioma a partir de genes marcadores.</span>
    </span>
  </a>
  (pronuncia-se "chime", tipo o sininho 🔔)?<br>
  Se no <a href="/guias/metaomicas/kraken2/">Kraken2</a> a gente sequencia <em>tudo</em> (metagenômica shotgun), aqui a ideia é outra:
  a gente sequencia só um pedacinho de um gene que todo mundo tem, como o
  <span class="tooltip"><strong>16S rRNA</strong>
    <span class="tooltiptext">Gene ribossomal presente em todas as bactérias e arqueias, com regiões conservadas e regiões variáveis (V1 a V9).</span>
  </span>
  das bactérias ou o
  <span class="tooltip"><strong>ITS</strong>
    <span class="tooltiptext">Internal Transcribed Spacer: região usada como "código de barras" para fungos.</span>
  </span>
  dos fungos. É o famoso <strong>metabarcoding</strong>: mais barato, mais rápido e perfeito para comparar muitas amostras.
</p>

<p>
  O QIIME 2 faz o caminho todo: importa as reads, limpa e corrige os erros de sequenciamento com o
  <span class="tooltip"><strong>DADA2</strong>
    <span class="tooltiptext">Algoritmo que corrige erros de sequenciamento e gera ASVs (Amplicon Sequence Variants), variantes exatas de sequência.</span>
  </span>,
  classifica cada sequência, monta uma árvore filogenética e calcula
  <span class="tooltip"><strong>diversidade alfa e beta</strong>
    <span class="tooltiptext">Alfa: diversidade dentro de uma amostra. Beta: quão diferentes as amostras são entre si.</span>
  </span>.
  E o melhor: ele gera visualizações interativas que você abre direto no navegador.
</p>

<blockquote class="info">
Ficou na dúvida entre metabarcoding e metagenômica? Expliquei a diferença no Medium:
<a href="https://krakenomics.medium.com/quem-est%C3%A1-na-festa-metataxonomia-metabarcoding-e-metagen%C3%B4mica-explicados-sem-mist%C3%A9rio-95bd5dcd1582" target="_blank">Quem está na festa?</a>
</blockquote>

O que você vai precisar <u>antes</u>:

- **Conda** — [instalação aqui](/guias/ambientes/anaconda/)
- **WSL/Linux** — [tutorial aqui](/guias/plataforma/wsl/) (o QIIME 2 não roda direto no Windows)
- **~15 GB de disco livre** e paciência na instalação (o ambiente é grandinho!)

Neste guia, <u>você vai</u>:

- Instalar o QIIME 2 num ambiente Conda,
- Entender o que são os arquivos <code>.qza</code> e <code>.qzv</code>,
- Rodar o fluxo completo com dados reais de 16S: DADA2 → classificação taxonômica → gráfico de barras → diversidade.

<img src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3ZXNyMGl5ZWJwa3pkcGxmcmhqN3dybDQwb3AwZ21kM3I1dHB0cnhqMSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3osxYeymtCD76SeQjC/giphy.gif" alt="gif" width="300" style="display:block; margin:auto;">

---

## Passo a passo
1. [Instalação](#instalacao)
2. [Artefatos e visualizações: o jeito QIIME 2 de trabalhar](#artefatos)
3. [Baixando os dados de exemplo](#dados)
4. [Olhando a qualidade das reads](#qualidade)
5. [Gerando ASVs com DADA2](#dada2)
6. [Filtrando e resumindo a tabela](#tabela)
7. [Classificação taxonômica](#taxonomia)
8. [Árvore filogenética e diversidade](#diversidade)

---

<h2 id="instalacao">1. Instalação</h2>

<p>
  O QIIME 2 é instalado a partir de um arquivo de ambiente pronto, que já vem com todos os plugins.
  Primeiro, atualize o Conda (recomendado):
</p>

<pre>
conda update conda -y
</pre>

Agora crie o ambiente com a versão <strong>2026.7</strong>:

<pre>
conda env create \
  --name qiime2-2026.7 \
  --file https://raw.githubusercontent.com/qiime2/distributions/refs/heads/dev/2026.7/qiime2/released/rachis-qiime2-linux-64-conda.yml

conda activate qiime2-2026.7
</pre>

<blockquote class="warning">
Essa instalação demora mesmo (pode levar de 10 a 30 minutos). Não feche o terminal, vai tomar um café ☕.
</blockquote>

Teste se deu tudo certo:

<pre>
qiime info
</pre>

<blockquote class="info">
O QIIME 2 lança versões novas algumas vezes por ano. Para instalar a mais recente, confira o número da versão no
<a href="https://library.qiime2.org/quickstart/amplicon" target="_blank">guia oficial de instalação</a> e troque <code>2026.7</code> nos comandos acima.<br>
Está num Mac com chip M1/M2/M3? Lá no guia oficial tem o comando específico (usa o Rosetta).
</blockquote>

---

<h2 id="artefatos">2. Artefatos e visualizações: o jeito QIIME 2 de trabalhar</h2>

<p>
  Antes de rodar qualquer coisa, entenda os dois tipos de arquivo do QIIME 2. Isso evita muita confusão depois:
</p>

<div class="table-wrap">
  <table>
    <thead>
      <tr>
        <th>Extensão</th>
        <th>O que é</th>
        <th>Como abrir</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>.qza</code></td>
        <td><strong>Artefato</strong>: dados (sequências, tabelas, árvores…) + o histórico de tudo que foi feito com eles.</td>
        <td>É entrada para o próximo comando.</td>
      </tr>
      <tr>
        <td><code>.qzv</code></td>
        <td><strong>Visualização</strong>: gráficos e tabelas interativas.</td>
        <td>Arraste para o <a href="https://view.qiime2.org" target="_blank">view.qiime2.org</a>.</td>
      </tr>
    </tbody>
  </table>
</div>

<blockquote class="tip">
Esse histórico dentro do <code>.qza</code> se chama
<span class="tooltip"><strong>provenance</strong>
  <span class="tooltiptext">Registro automático de todos os comandos, parâmetros e versões usados para gerar aquele arquivo.</span>
</span>.
Seis meses depois, quando o revisor perguntar "qual parâmetro você usou no DADA2?", é só abrir o arquivo no view.qiime2.org e olhar a aba <em>Provenance</em>. Reprodutibilidade de graça!
</blockquote>

<p>
  Os comandos sempre seguem o mesmo padrão: <code>qiime PLUGIN AÇÃO</code>, e as opções começam com
  <code>--i-</code> (entrada), <code>--p-</code> (parâmetro), <code>--m-</code> (metadados) e <code>--o-</code> (saída).
</p>

---

<h2 id="dados">3. Baixando os dados de exemplo</h2>

<p>
  Vamos usar os dados do tutorial oficial <em>Gut-to-soil</em>: amostras de 16S de um experimento de compostagem 💩🌱.
  As reads já vêm importadas e separadas por amostra (<code>demux.qza</code>), junto com a tabela de metadados.
</p>

<pre>
mkdir -p ~/qiime2_tutorial
cd ~/qiime2_tutorial

wget -O sample-metadata.tsv \
  https://gut-to-soil-tutorial.readthedocs.io/en/latest/data/gut-to-soil/sample-metadata.tsv
wget -O demux.qza \
  https://gut-to-soil-tutorial.readthedocs.io/en/latest/data/gut-to-soil/demux.qza
</pre>

Dê uma olhada nos metadados:

<pre>
qiime metadata tabulate \
  --m-input-file sample-metadata.tsv \
  --o-visualization sample-metadata.qzv
</pre>

<blockquote class="info">
Quer usar <strong><u>seus próprios FASTQs</u></strong>? Monte um arquivo <code>manifest.tsv</code> com três colunas
(<code>sample-id</code>, <code>forward-absolute-filepath</code>, <code>reverse-absolute-filepath</code>) e importe:
<pre>
qiime tools import \
  --type 'SampleData[PairedEndSequencesWithQuality]' \
  --input-path manifest.tsv \
  --input-format PairedEndFastqManifestPhred33V2 \
  --output-path demux.qza
</pre>
O resto do guia continua igualzinho.
</blockquote>

---

<h2 id="qualidade">4. Olhando a qualidade das reads</h2>

<pre>
qiime demux summarize \
  --i-data demux.qza \
  --o-visualization demux.qzv
</pre>

<p>
  Abra o <code>demux.qzv</code> no <a href="https://view.qiime2.org" target="_blank">view.qiime2.org</a> e vá na aba
  <strong>Interactive Quality Plot</strong>. Repare em qual posição a qualidade das reads começa a cair.
  É com base nisso que você escolhe onde cortar as reads no próximo passo.
</p>

<blockquote class="tip">
Regra prática: corte onde a mediana da qualidade fica abaixo de ~Q25–Q30. Mas lembre: as reads R1 e R2 ainda precisam
<strong>se sobrepor</strong> (pelo menos ~20 bases) para o DADA2 conseguir juntá-las. Para a região V4 (~250 pb), cortar em 250/250 sobra overlap tranquilo.
</blockquote>

---

<h2 id="dada2">5. Gerando ASVs com DADA2</h2>

<p>
  Aqui acontece a mágica: o DADA2 filtra, corrige os erros de sequenciamento, junta R1 com R2, remove quimeras e gera as
  <span class="tooltip"><strong>ASVs</strong>
    <span class="tooltiptext">Amplicon Sequence Variants: sequências exatas, sem agrupar por 97% de similaridade como as antigas OTUs.</span>
  </span>.
</p>

<pre>
qiime dada2 denoise-paired \
  --i-demultiplexed-seqs demux.qza \
  --p-trim-left-f 0 \
  --p-trunc-len-f 250 \
  --p-trim-left-r 0 \
  --p-trunc-len-r 250 \
  --o-representative-sequences asv-seqs.qza \
  --o-table asv-table.qza \
  --o-denoising-stats denoising-stats.qza \
  --o-base-transition-stats base-transition-stats.qza
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
        <td><code>--p-trim-left-f / -r</code></td>
        <td>Quantas bases cortar no <strong>início</strong> das reads (ex.: para remover primers).</td>
      </tr>
      <tr>
        <td><code>--p-trunc-len-f / -r</code></td>
        <td>Em que posição <strong>truncar</strong> as reads (onde a qualidade cai).</td>
      </tr>
      <tr>
        <td><code>--o-table</code></td>
        <td>Tabela de contagem: quantas vezes cada ASV aparece em cada amostra.</td>
      </tr>
      <tr>
        <td><code>--o-representative-sequences</code></td>
        <td>A sequência de cada ASV.</td>
      </tr>
      <tr>
        <td><code>--o-denoising-stats</code></td>
        <td>Quantas reads sobraram em cada etapa (filtragem, junção, quimeras).</td>
      </tr>
    </tbody>
  </table>
</div>

Confira quantas reads sobreviveram:

<pre>
qiime metadata tabulate \
  --m-input-file denoising-stats.qza \
  --o-visualization denoising-stats.qzv
</pre>

<blockquote class="warning">
Se a coluna <code>percentage of input merged</code> estiver muito baixa (tipo abaixo de 50%), provavelmente você truncou demais
e as reads R1 e R2 não estão mais se sobrepondo. Volte e aumente o <code>--p-trunc-len</code>.
</blockquote>

---

<h2 id="tabela">6. Filtrando e resumindo a tabela</h2>

Remova as ASVs que aparecem em só uma amostra (geralmente ruído) e filtre as sequências para combinar com a tabela:

<pre>
qiime feature-table filter-features \
  --i-table asv-table.qza \
  --p-min-samples 2 \
  --o-filtered-table asv-table-ms2.qza

qiime feature-table filter-seqs \
  --i-data asv-seqs.qza \
  --i-table asv-table-ms2.qza \
  --o-filtered-data asv-seqs-ms2.qza
</pre>

Agora gere o resumo da tabela (esse você vai precisar no passo 8!):

<pre>
qiime feature-table summarize \
  --i-table asv-table-ms2.qza \
  --m-metadata-file sample-metadata.tsv \
  --o-summary asv-table-ms2.qzv \
  --o-sample-frequencies sample-frequencies-ms2.qza \
  --o-feature-frequencies asv-frequencies-ms2.qza
</pre>

<blockquote class="tip">
No <code>asv-table-ms2.qzv</code>, a aba <strong>Interactive Sample Detail</strong> mostra quantas reads cada amostra tem.
Anote um número que mantenha a maioria das amostras: ele vai ser a <strong>profundidade de rarefação</strong> no passo 8.
</blockquote>

---

<h2 id="taxonomia">7. Classificação taxonômica</h2>

<p>
  Para dizer <strong>quem</strong> é cada ASV, a gente usa um
  <span class="tooltip"><strong>classificador</strong>
    <span class="tooltiptext">Modelo Naive Bayes treinado com sequências de referência e suas taxonomias (ex.: SILVA, Greengenes2, GTDB).</span>
  </span>
  já treinado. Para o tutorial, baixe o classificador pequeno que acompanha os dados:
</p>

<pre>
wget -O suboptimal-16S-rRNA-classifier.qza \
  https://gut-to-soil-tutorial.readthedocs.io/en/latest/data/gut-to-soil/suboptimal-16S-rRNA-classifier.qza

qiime feature-classifier classify-sklearn \
  --i-classifier suboptimal-16S-rRNA-classifier.qza \
  --i-reads asv-seqs-ms2.qza \
  --o-classification taxonomy.qza
</pre>

<blockquote class="warning">
Esse classificador é "subótimo" de propósito: ele é leve para rodar em qualquer computador durante a aula.
Para os <strong><u>seus dados de verdade</u></strong>, use um classificador completo (SILVA, Greengenes2…) da
<a href="https://library.qiime2.org/data-resources" target="_blank">página de recursos do QIIME 2</a>,
<strong>da mesma versão</strong> do QIIME 2 que você instalou, e de preferência treinado para a sua região (ex.: V4, 515F/806R).
</blockquote>

Agora o gráfico que todo mundo quer ver, o de barras empilhadas:

<pre>
qiime taxa barplot \
  --i-table asv-table-ms2.qza \
  --i-taxonomy taxonomy.qza \
  --m-metadata-file sample-metadata.tsv \
  --o-visualization taxa-bar-plots.qzv
</pre>

<blockquote class="tip">
Abra o <code>taxa-bar-plots.qzv</code> no view.qiime2.org. Dá pra mudar o nível taxonômico (filo, classe, gênero…),
ordenar as amostras por qualquer coluna dos metadados (tenta <code>SampleType</code>!) e baixar a figura em SVG.
</blockquote>

---

<h2 id="diversidade">8. Árvore filogenética e diversidade</h2>

<p>
  Algumas métricas de diversidade, como
  <span class="tooltip"><strong>Faith PD</strong>
    <span class="tooltiptext">Diversidade filogenética: soma dos ramos da árvore ocupados pelas ASVs de uma amostra.</span>
  </span>
  e
  <span class="tooltip"><strong>UniFrac</strong>
    <span class="tooltiptext">Distância entre amostras que leva em conta o parentesco evolutivo das ASVs.</span>
  </span>,
  precisam de uma árvore. Bora montar:
</p>

<pre>
qiime phylogeny align-to-tree-mafft-fasttree \
  --i-sequences asv-seqs-ms2.qza \
  --o-alignment aligned-asv-seqs.qza \
  --o-masked-alignment masked-aligned-asv-seqs.qza \
  --o-tree unrooted-tree.qza \
  --o-rooted-tree rooted-tree.qza
</pre>

Agora calcule várias métricas de uma vez. Troque o <code>1800</code> pelo valor que você anotou no passo 6:

<pre>
qiime diversity core-metrics-phylogenetic \
  --i-phylogeny rooted-tree.qza \
  --i-table asv-table-ms2.qza \
  --p-sampling-depth 1800 \
  --m-metadata-file sample-metadata.tsv \
  --output-dir core-metrics-results
</pre>

<blockquote class="info">
O <code>--p-sampling-depth</code> faz a
<span class="tooltip"><strong>rarefação</strong>
  <span class="tooltiptext">Sorteia o mesmo número de reads em todas as amostras, para comparar de forma justa.</span>
</span>.
Amostras com menos reads que esse valor ficam de fora. Valor alto demais = perde amostras; baixo demais = perde informação.
</blockquote>

A pasta <code>core-metrics-results/</code> tem várias coisas legais. Dois exemplos para começar:

<pre>
# Diversidade alfa (dentro da amostra): compara os grupos de cada coluna dos metadados
qiime diversity alpha-group-significance \
  --i-alpha-diversity core-metrics-results/faith_pd_vector.qza \
  --m-metadata-file sample-metadata.tsv \
  --o-visualization core-metrics-results/faith-pd-group-significance.qzv

# Diversidade beta (entre amostras): os grupos de SampleType são diferentes? (PERMANOVA)
qiime diversity beta-group-significance \
  --i-distance-matrix core-metrics-results/unweighted_unifrac_distance_matrix.qza \
  --m-metadata-file sample-metadata.tsv \
  --m-metadata-column SampleType \
  --p-pairwise \
  --o-visualization core-metrics-results/unweighted-unifrac-sampletype-significance.qzv
</pre>

<blockquote class="tip">
Não deixe de abrir o <code>core-metrics-results/unweighted_unifrac_emperor.qzv</code>: é a
<span class="tooltip"><strong>PCoA</strong>
  <span class="tooltiptext">Análise de Coordenadas Principais: mostra as amostras num gráfico onde amostras parecidas ficam perto.</span>
</span>
em 3D, que dá pra girar e colorir pelos metadados. É aquele gráfico que vai pro artigo!
</blockquote>

---

# Conclusão

Você rodou um fluxo completo de <strong>metabarcoding de 16S</strong> com o QIIME 2:

- Avaliação da qualidade das reads
- Correção de erros e geração de ASVs com DADA2
- Classificação taxonômica e gráfico de barras
- Árvore filogenética, diversidade alfa e beta

E tudo isso com o histórico guardado dentro de cada <code>.qza</code>. Seu "eu do futuro" agradece.

Até a próxima!

<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDBrMGdzbmx6cDh4MjF6anMzbzltNXpzY3Zia21hdDl6bmpsMzBsciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/bCFrooOBnpd276aY7r/giphy.gif" alt="gif" width="200" style="display:block; margin:auto;">

---

## Desafio!!!

Troque o classificador "subótimo" por um classificador completo (SILVA ou Greengenes2) e compare os dois gráficos de barras.
Quantos gêneros a mais aparecem?<br>
Depois, tente colocar tudo num <a href="/guias/ambientes/snakemake/" target="_blank">**Snakefile**</a>: cada comando do QIIME 2 vira uma regra!<br>
Até a próxima!

---

Dê um suporte ao meu projeto. Doe um cafézinho ☕.<br>
Pix: biologolee@gmail.com<br>
Bitcoin: bc1qg7qrfhclzt3sm60en53qv8fmwpuacfaxt5v55k

![QR Code](/assets/img/meus_projetos/bluewallet_qrcode.png)

---

# Referências

1. <a href="https://qiime2.org/" target="_blank">QIIME 2 — site oficial</a>
2. <a href="https://library.qiime2.org/quickstart/amplicon" target="_blank">Guia oficial de instalação</a>
3. <a href="https://amplicon-docs.qiime2.org/en/latest/tutorials/gut-to-soil/" target="_blank">Tutorial Gut-to-soil (dados usados neste guia)</a>
4. <a href="https://www.nature.com/articles/s41587-019-0209-9" target="_blank">Reproducible, interactive, scalable and extensible microbiome data science using QIIME 2 (Nature Biotechnology, 2019)</a>
5. <a href="https://www.nature.com/articles/nmeth.3869" target="_blank">DADA2: High-resolution sample inference from Illumina amplicon data (Nature Methods, 2016)</a>
6. <a href="https://library.qiime2.org/data-resources" target="_blank">Classificadores pré-treinados e outros recursos</a>
7. <a href="https://view.qiime2.org" target="_blank">QIIME 2 View</a>
8. <a href="https://forum.qiime2.org/" target="_blank">Fórum do QIIME 2 (o melhor lugar pra tirar dúvidas!)</a>
