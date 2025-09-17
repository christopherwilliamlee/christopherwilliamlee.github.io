---
layout: guia
title: Tutorial de instalação do Falco (Conda)
permalink: /guias/qualidade/falco/
---

![Falco logo](/assets/img/falco/falco_logo.png)

# <u>Instalação do Falco com Conda</u>

<p style="text-align: justify">
  Fala, pessoal! Quem já precisou lidar com dezenas ou até centenas de arquivos FASTQ sabe 
  que rodar análise de qualidade em cada um pode virar uma maratona.  
  É lento, repetitivo e nada prático quando você trabalha em larga escala.<br>
  O 
  <a href="https://github.com/smithlabcode/falco" target="_blank">
    <span class="tooltip"><strong>Falco</strong>
      <span class="tooltiptext">Ferramenta rápida para avaliação em lote de arquivos FASTQ.</span>
    </span>
  </a> 
  surgiu justamente para resolver isso.  
  Ele é basicamente um: FASTQC turbinado! Gera todos os gráficos de qualidade em formato interativo com 
  <span class="tooltip"><strong>Plotly</strong>
    <span class="tooltiptext">Biblioteca que permite zoom, hover e visualização dinâmica nos relatórios HTML.</span>
  </span>, 
  mas aproveitando ao máximo 
  <span class="tooltip"><strong>multicore e clusters</strong>
    <span class="tooltiptext">Execução paralela em vários núcleos ou até mesmo em HPC.</span>
  </span>. 
  No final, você tem a mesma profundidade de avaliação que teria com o FastQC, só que 
  <strong>muito mais rápido</strong>, com relatórios que podem ser facilmente integrados ao 
  <a href="https://multiqc.info/" target="_blank">
    <span class="tooltip"><strong>MultiQC</strong>
      <span class="tooltiptext">Ferramenta que junta relatórios de vários programas em um só lugar.</span>
    </span>
  </a>.
</p>

<p>
  Resumindo: se o FastQC é o clássico para controle de qualidade, o Falco é a sua <strong>versão turbinada para escala</strong>.  
</p>



O que você vai precisar <u>antes</u>:

- **Conda**: caso ainda não conheça ou não tenha instalado, confira o <a href="/guias/ambientes/anaconda" target="_blank">tutorial de instalação</a>.  
- **WSL**: se você ainda não usa o Windows Subsystem for Linux, veja o <a href="/guias/plataforma/wsl" target="_blank">passo a passo aqui</a>.  
- **SRA-Tools**: útil para baixar arquivos FASTQ diretamente de bancos públicos como o ENA/SRA. Veja o <a href="/guias/ferramentas/sra_tools" target="_blank">tutorial aqui</a>.  

Neste guia, <u>você vai</u>:

- Criar um ambiente Conda e instalar o **Falco** dentro dele,  
- Entender a função dessa ferramenta,  
- Rodar uma análise de exemplo e visualizar os relatórios.  

<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExejk4bWdiNDN0czFkOHZiazMwZGZpNGFzNzJsZ3RqZWdjZnhucDFyMCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2SQiuHOqSQybGVh9lX/giphy.gif" alt="gif" width="200" style="display:block; margin:auto;">

---

## Passo a passo

1. [Instalação](#instalacao)
2. [Rodando sua primeira análise](#primeira-analise)

<h2 id="instalacao">1. Criando o ambiente e instalando o Falco</h2>

<p>
  Antes de rodar o Falco, você precisa ter o 
  <span class="tooltip"><strong>Conda</strong>
    <span class="tooltiptext">Gerenciador de pacotes e ambientes para instalar ferramentas de bioinformática.</span>
  </span> 
  configurado na sua máquina.
</p>

<blockquote class="info">
  Se você já tiver o Conda ou Miniconda instalado, pode pular este passo.  
  Para verificar, rode <code>conda --version</code> no terminal.
</blockquote>

<p>
  O ideal é manter o Falco em um <strong>ambiente isolado</strong>, assim você evita conflitos de versão e mantém o sistema organizado.  
  Para criar o ambiente e instalar o Falco de uma vez, rode:
</p>

<pre>
conda create -n falco-env -c bioconda -c conda-forge falco -y
conda activate falco-env
</pre>

<blockquote class="info">
  Esse passo é recomendado porque:<br>  
  • mantém o ambiente do sistema limpo,<br>  
  • garante que todos terão as mesmas versões das ferramentas,<br>  
  • facilita repetir a análise em qualquer máquina.
</blockquote>

<p>
  Depois de ativar o ambiente, confirme se o Falco está funcionando:
</p>

<pre>
falco --version
</pre>

<p>
Saída esperada:
<pre>
falco vX.X.X
</pre>
</p>

---

<h2 id="primeira-analise">2. Rodando sua primeira análise (Falco)</h2>

<p style="text-align: justify">
  Agora que o <strong>Falco</strong> está instalado, vamos rodar nossa primeira análise de controle de qualidade.  
  O Falco foi feito para processar <strong>muitos FASTQs em paralelo</strong>, de forma rápida e escalável e ideal para clusters ou HPC.
</p>

<h3>2.1 Criando a estrutura do projeto</h3>

Crie uma pasta para organizar o teste e adicione um diretório de dados:

<pre>
mkdir -p ~/falco_tutorial/data
cd ~/falco_tutorial
</pre>

Coloque 1–2 arquivos FASTQ em <code>data/</code> (ou baixe algum exemplo público com o SRA-Tools).

<blockquote class="tip">
Não tem arquivos FASTQ em mãos? Sem problema!<br>
Você pode baixar um exemplo pequeno do ENA/SRA, como o <code>SRR34840432</code>.  

<pre>prefetch SRR34840432 -O data/</pre>  

Para isso, será necessário usar o <strong>SRA-Tools</strong>.  
Caso ainda não conheça ou não tenha instalado, confira o 
<a href="/guias/ferramentas/sra-tools/" target="_blank">tutorial completo aqui</a>.
</blockquote>


<blockquote class="warning">
Versões antigas do <code>SRA-Tools</code> (ex.: 2.9.x) podem gerar erros de conexão TLS/SSL ao usar <code>prefetch</code> ou <code>fastq-dump</code>.  
Antes de usar, confira sua versão com:  

<pre><code>prefetch -V</code></pre>

Para desinstalar a versão antiga basta digitar:
<pre><code>conda remove sra-tools</code></pre>

Para instalar a versão mais nova no mesmo ambiente basta digitar:
<pre><code>conda install -c bioconda -c conda-forge sra-tools -y</code></pre>
</blockquote>


<h3>2.2 Rodando o Falco</h3>

<p>
  Para analisar todos os arquivos FASTQ dentro da pasta <code>data/</code>, rode:
</p>

<pre>
mkdir -p results
falco data/*.fastq.gz -o results/
</pre>

<ul>
  <li><code>-o</code>: diretório de saída onde serão salvos os relatórios.</li>
</ul>

<p>
  O Falco irá processar todos os arquivos em paralelo e gerar estatísticas de qualidade em <code>results/</code>.  
  Os principais resultados incluem:
</p>

<ul>
  <li><strong>Resumo tabular</strong>: métricas por arquivo (número de reads, tamanho médio, distribuição de qualidade, etc.).</li>
  <li><strong>Relatórios individuais</strong>: dados básicos de cada FASTQ.</li>
</ul>

![Falco 1](/assets/img/falco/falco_1.png)

<blockquote class="tip">
Para consolidar os resultados em um único relatório, utilize o <a href="https://multiqc.info/" target="_blank">MultiQC</a>.
</blockquote>

<blockquote class="info">
Você ainda não sabe como interpretar os gráficos do Falco? Não se preocupe! Você pode encontrar a explicação no nosso <a href="medium.com/#" target="_blank">medium - Falco</a>.
</blockquote>

---

# Conclusão

<p style="text-align: justify">
Direto ao ponto: missão cumprida!
Você configurou o ambiente <span class="badge badge--conda">Conda</span>, instalou o <strong>Falco</strong> e rodou sua primeira checagem em arquivos FASTQ. O Falco entra como aquele aliado rápido quando você tem muitos dados para inspecionar de uma vez. E o melhor: seus relatórios podem ser integrados no <strong>MultiQC</strong>, centralizando tudo em uma visão única e organizada.  
</p>

Até a próxima!  

<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnJzYTVpaTNjb2E0MXhuZWx4dXB1ZDlqMzdraDAzdmM2cnlwZ3E2diZlcD12MV9naWZzX3NlYXJjaCZjdD1n/uWlpPGquhGZNFzY90z/giphy.gif" alt="gif" width="200" style="display:block; margin:auto;">

---

Se curtiu, dá aquele apoio no <a href="https://www.linkedin.com/in/christopher-lee-390643197/" target="_blank">LinkedIn</a> e considere um cafézinho ☕ para manter o projeto vivo. Valeu!

Pix: [biologolee@gmail.com](mailto:biologolee@gmail.com)<br>
Bitcoin: bc1qg7qrfhclzt3sm60en53qv8fmwpuacfaxt5v55k  

![QR Code](/assets/img/meus_projetos/bluewallet_qrcode.png)

---

# Referências

1. <a href="https://github.com/smithlabcode/falco" target="_blank">Repositório oficial do Falco</a>  
2. <a href="https://europepmc.org/article/pmc/pmc7845152" target="_blank">Artigo do Falco</a>  
3. <a href="https://docs.conda.io/projects/conda/en/latest/index.html/" target="_blank">Conda</a>  
4. <a href="https://multiqc.info/" target="_blank">MultiQC</a>  
