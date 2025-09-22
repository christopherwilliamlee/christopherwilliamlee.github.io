---
layout: guia
title: Tutorial prático do Fastp (Conda)
permalink: /guias/aparadores/fastp/
---

![Fastp logo](/assets/img/fastp/fastp_logo.png)

# <u>Workflow com Fastp: pipeline completo de QC de FASTQ</u>

<p style="align-text: justify">
  Fala, pessoal! Bora falar sobre o 
  <a href="https://github.com/OpenGene/fastp" target="_blank">
    <span class="tooltip"><strong>Fastp</strong>
      <span class="tooltiptext">Ferramenta ultrarrápida para pré-processamento de FASTQ.</span>
    </span>
  </a>?<br>
  Quem já trabalhou com dados de sequenciamento sabe a dor de cabeça que pode ser
  preparar arquivos FASTQ: precisa rodar uma ferramenta pra fazer o trimming, outra pra filtrar leituras ruins,
  depois ainda conferir a qualidade com um programa separado…<br>
  O Fastp chegou justamente pra simplificar essa história. Ele junta em um único pacote 
  o que antes exigia várias etapas e ferramentas como <strong>Trimmomatic</strong> e <strong>Cutadapt</strong>.
  Além de ser bem mais rápido, ele foi pensado para pipelines modernas de bioinformática.
  Com ele, você consegue fazer 
  <span class="tooltip"><strong>filtragem</strong>
    <span class="tooltiptext">Remove leituras de baixa qualidade ou contaminadas.</span>
  </span>, 
  <span class="tooltip"><strong>trimming</strong>
    <span class="tooltiptext">Corta bases de baixa qualidade nas extremidades das leituras.</span>
  </span> 
  e até 
  <span class="tooltip"><strong>controle de qualidade</strong>
    <span class="tooltiptext">Avalia a qualidade geral das leituras e gera estatísticas detalhadas.</span>
  </span> 
  em um só comando. E o melhor:
  ao final ele gera relatórios bonitos em 
  <span class="tooltip"><strong>HTML</strong>
    <span class="tooltiptext">Relatório interativo para inspeção manual da qualidade.</span>
  </span> 
  (pra você explorar na mão) e em 
  <span class="tooltip"><strong>JSON</strong>
    <span class="tooltiptext">Formato estruturado para análise automatizada em pipelines.</span>
  </span> 
  (perfeito pra integrar no fluxo automático).
</p>


<p>
  Resumindo: o Fastp é tipo aquele canivete suíço do pré-processamento de FASTQ.
  Depois que você se acostuma com ele, fica difícil voltar a fazer cada etapa em uma ferramenta separada.
</p>

O que você vai precisar <u>antes</u>:

- **Conda** — [instalação aqui](/guias/ambientes/anaconda/)  
- **WSL/Linux** — [tutorial aqui](/guias/plataforma/wsl)  
- **SRA-Tools** — útil para baixar FASTQs públicos ([guia](/guias/ferramentas/sra-tools))  

<p>
  Neste guia vamos montar um <span class="tooltip"><strong>pipeline completo de controle de qualidade</strong>
    <span class="tooltiptext">Fluxo que cobre desde a checagem inicial até a consolidação final dos relatórios.</span>
  </span> 
  para dados de sequenciamento, incluindo:
</p>

- Avaliação inicial dos FASTQs (pré-trimming com Falco)  
- Trimming e filtragem com Fastp  
- Nova checagem de qualidade (pós-trimming com Falco)  
- Consolidação final com MultiQC  


<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzc3ODZjNXE1aWp2M2x1aTViZWdxMTZ5MWJsOXlqNzRuem9rbXM4bCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ggVzx0w0umA5ozxTfu/giphy.gif" alt="gif" width="300" style="display:block; margin:auto;">

---

## Passo a passo
1. [Preparação do ambiente](#preparacao-ambiente)
2. [Avaliação da qualidade (pré-trimming)](#avaliacao-pre-trimming)
3. [Trimming e filtragem com Fastp](#trimming-fastp)
4. [Avaliação da qualidade (pós-trimming)](#avaliacao-pos-trimming)
5. [Consolidação dos relatórios com MultiQC](#multiqc)

---

<h2 id="preparacao-ambiente">1. Preparação do ambiente</h2>

Baixe e extraia os arquivos de exemplo:

<pre>
wget 'https://drive.google.com/uc?export=download&id=11kdJnIvsXiOn3-dRKsAz4ATokhCo-gAW' -O analise_dados.tgz
tar -xvzf analise_dados.tgz
</pre>

<blockquote class="info">
Os arquivos de exemplo disponibilizados no Drive servem apenas para facilitar a prática das aulas.  
Se preferir, você pode usar <strong><u>seus próprios dados</u></strong> ou até baixar FASTQs públicos pelo 
<a href="/guias/ferramentas/sra-tools/" target="_blank">SRA-Tools</a>.  
</blockquote>

Crie a estrutura de pastas:

<pre>
mkdir analise_dados/aula_1
cd analise_dados/aula_1

mkdir adaptadores pre_trim pos_trim
mkdir pre_trim/ pos_trim/

wget https://raw.githubusercontent.com/usadellab/Trimmomatic/main/adapters/TruSeq3-PE.fa
mv TruSeq3-PE.fa adaptadores/
mv ../meta_aula_1_L001* pre_trim/
</pre>

Crie o ambiente único:

<pre>
conda create -n qc -c bioconda -c conda-forge fastp falco multiqc -y
conda activate qc
</pre>

<blockquote class="info">
<strong>qc</strong> é o nome que a gente deu e é o nome do ambiente (vem de "quality control").  
Dentro dele você já terá <code>fastp</code>, <code>falco</code> e <code>multiqc</code>.
</blockquote>

---

<h2 id="avaliacao-pre-trimming">2. Avaliação da qualidade (pré-trimming)</h2>
Entre na pasta `pre_trim` e rode o Falco nos FASTQs brutos:

<pre>
cd pre_trim
mkdir -p results
falco *.fastq.gz -o results/
</pre>

<blockquote class="tip">
O <code>falco</code> é um substituto ultrarrápido do <strong>FastQC</strong>, ideal para inspeção inicial de qualidade.
</blockquote>

---

<h2 id="trimming-fastp">3. Trimming e filtragem com Fastp</h2>

Agora rode o **Fastp** para remover adaptadores, cortar regiões de baixa qualidade e descartar reads ruins:

<pre>
fastp \
  -i meta_aula_1_L001_R1_001.fastq.gz \
  -I meta_aula_1_L001_R2_001.fastq.gz \
  -o ../pos_trim/meta_aula_trim_1_L001_R1_001.fastq.gz \
  -O ../pos_trim/meta_aula_trim_1_L001_R2_001.fastq.gz \
  --dont_eval_duplication \
  --cut_right --cut_right_window_size 4 --cut_right_mean_quality 20 \
  --length_required 36 \
  --average_qual 20 \
  --adapter_fasta ../adaptadores/TruSeq3-PE.fa
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
        <td><code>--cut_right</code></td>
        <td>Ativa corte adaptativo no fim das reads.</td>
      </tr>
      <tr>
        <td><code>--cut_right_window_size 4</code></td>
        <td>Tamanho da janela de corte dinâmico.</td>
      </tr>
      <tr>
        <td><code>--cut_right_mean_quality 20</code></td>
        <td>Qualidade mínima da janela (Q20).</td>
      </tr>
      <tr>
        <td><code>--length_required 36</code></td>
        <td>Descarta reads menores que 36 pb.</td>
      </tr>
      <tr>
        <td><code>--average_qual 20</code></td>
        <td>Remove reads com qualidade média abaixo de Q20.</td>
      </tr>
      <tr>
        <td><code>--adapter_fasta</code></td>
        <td>Arquivo com sequências de adaptadores (ex.: TruSeq3-PE).</td>
      </tr>
    </tbody>
  </table>
</div>


<blockquote class="info">
O Fastp gera automaticamente relatórios <code>.html</code> e <code>.json</code> para inspeção e integração em pipelines.
</blockquote>

---

<h2 id="avaliacao-pos-trimming">4. Avaliação da qualidade (pós-trimming)</h2>

Agora rode o Falco nos arquivos processados:

<pre>
cd ../pos_trim
mkdir -p results
falco *.fastq.gz -o results/
</pre>

<blockquote class="tip">
Compare os relatórios <em>pré</em> e <em>pós</em> trimming para validar a limpeza dos dados.
</blockquote>

---

<h2 id="multiqc">5. Consolidação dos relatórios com MultiQC</h2>

Use o MultiQC para juntar tudo em um único relatório:

<pre>
multiqc results/ -o multiqc_report/ -c multiqc_config.yaml -m fastqc -v
</pre>

<blockquote class="tip">
Isso gera <code>multiqc_report.html</code>, que você pode abrir no navegador e visualizar todos os relatórios juntos.
</blockquote>
<blockquote class="info">
Não sabe o que é o MultiQC ou ficou em dúvida sobre o que está acontecendo?  
Confira o <a href="/guias/qualidade/multiqc/" target="_blank">tutorial completo do MultiQC</a>.
</blockquote>


---

# Conclusão

Você concluiu um <strong>pipeline completo de controle de qualidade</strong> para FASTQ:  

- Pré-QC com Falco  
- Trimming e filtragem com Fastp  
- Pós-QC com Falco  
- Consolidação com MultiQC  

Esse fluxo garante dados limpos, relatórios organizados e <strong>reprodutibilidade</strong> do começo ao fim.

Agora seus dados estão prontos para análises downstream.

---

## Desafio!!!

E se você integrar esse fluxo em um <a href="/guias/ambientes/snakemake" target="_blank">**Snakefile**</a> ou <a href="/guias/ambientes/snakemake" target="_blank">**Nextflow pipeline**</a>?<br>
Isso garante ainda mais reprodutibilidade e automação!<br>
Até a próxima!

<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWl3cGxwdGR2dXIydGkwNmI0ZHRocGZ2eXR1Y2llZWxoNWo2cnNrMyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l0Iyl55kTeh71nTXy/giphy.gif" alt="gif" width="300" style="display:block; margin:auto;">

---

Dê um suporte ao meu projeto. Doe um cafézinho ☕.<br>
Pix: biologolee@gmail.com<br>
Bitcoin: bc1qg7qrfhclzt3sm60en53qv8fmwpuacfaxt5v55k

![QR Code](/assets/img/meus_projetos/bluewallet_qrcode.png)

---

# Referências

1. <a href="https://docs.conda.io/projects/conda/en/latest/index.html/" target="_blank">Documentação oficial do Conda</a>
2. <a href="https://github.com/ncbi/sra-tools/wiki" target="_blank">SRA-Tools (Wiki oficial)</a>
3. <a href="https://github.com/OpenGene/fastp" target="_blank">fastp — repositório oficial</a>
4. <a href="https://academic.oup.com/bioinformatics/article/34/17/i884/5093234" target="_blank">fastp: an ultra-fast all-in-one FASTQ preprocessor (Bioinformatics, 2018)</a>
5. <a href="https://bioconda.github.io/recipes/fastp/README.html" target="_blank">Pacote fastp no Bioconda</a>
6. <a href="https://github.com/smithlabcode/falco" target="_blank">Falco — repositório oficial</a>
7. <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7845152/" target="_blank">Falco: high-speed FastQC emulation (Nucleic Acids Research, 2021)</a>
8. <a href="https://multiqc.info/" target="_blank">MultiQC — site oficial</a>