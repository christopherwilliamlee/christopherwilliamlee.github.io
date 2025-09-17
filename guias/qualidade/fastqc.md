---
layout: guia
title: Tutorial de instalação do FastQC (Conda)
permalink: /guias/qualidade/fastqc/
---

![FastQC logo](/assets/img/fastqc/fastqc_logo.png)

# <u>Instalação do FastQC com Conda</u>

<p>
  Fala, galera! Bora instalar o
  <a href="https://www.bioinformatics.babraham.ac.uk/projects/fastqc/" target="_blank">
    <span class="tooltip">FastQC
      <span class="tooltiptext">Ferramenta para avaliar a qualidade de arquivos FASTQ de sequenciamento.</span>
    </span>
  </a>
  rapidinho usando o Conda? <br><br>
  Se você trabalha com bioinformática, logo vai precisar checar a
  <span class="tooltip">qualidade de dados
    <span class="tooltiptext">Métricas como conteúdo GC, qualidade por base, duplicação e presença de adaptadores.</span>
  </span>
  antes de rodar suas análises pesadas. O FastQC é aquele que mostra se os seus FASTQs estão ok para seguir em frente. Ele gera relatórios bonitos em HTML e também tabelas de resultados que você pode usar em análises automáticas.
</p>

O que você vai precisar <u>antes</u>:

- **Conda**: caso ainda não conheça ou não tenha instalado, confira o <a href="/guias/ambientes/anaconda.md" target="_blank">tutorial de instalação</a>.  
- **WSL**: se você ainda não usa o Windows Subsystem for Linux, veja o <a href="/guias/plataforma/wsl.md" target="_blank">passo a passo aqui</a>.  
- **SRA-Tools**: necessário para baixar arquivos FASTQ diretamente de bancos públicos como o ENA/SRA. Veja o <a href="/guias/ferramentas/sra_tools.md" target="_blank">tutorial aqui</a>.  

Neste guia, <u>você vai</u>:

- Criar um ambiente Conda e instalar o **FastQC** dentro dele,  
- Entender a função dessa ferramenta,  
- Rodar uma análise de exemplo e visualizar o relatório.  

<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaThteTQ3M3lyZTE2NmQ3bmd1aDZuaG5ybDQ4Mm1keHRheGhtdDg4NSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/efEqfxjNeSFFu/giphy.gif" alt="gif" width="200" style="display:block; margin:auto;">

---

## Passo a passo

1. [Instalação](#instalacao) 
2. [Rodando sua primeira análise](#primeira-analise)

<h2 id="instalacao">1. Criando o ambiente e instalando o FastQC</h2>

<p>
  Antes de rodar o FastQC, você precisa ter o 
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
  O ideal é manter o FastQC em um <strong>ambiente isolado</strong>, assim você evita conflitos de versão e mantém o sistema organizado.  
  Para criar o ambiente e instalar o FastQC de uma vez, rode:
</p>

<pre>
conda create -n fastqc-env -c bioconda -c conda-forge fastqc -y
conda activate fastqc-env
</pre>

<blockquote class="info">
  Esse passo é recomendado porque:<br>  
  • mantém o ambiente do sistema limpo,<br>  
  • garante que todos terão as mesmas versões das ferramentas,<br>  
  • facilita repetir a análise em qualquer máquina.
</blockquote>

<p>
  Depois de ativar o ambiente, confirme se o FastQC está funcionando:
</p>

<pre>
fastqc --version
</pre>

<p>
Saída esperada:
<pre>
FastQC v0.xx.x
</pre>
</p>

---

<h2 id="primeira-analise">2. Rodando sua primeira análise (FastQC)</h2>

<p>
  Agora que o <strong>FastQC</strong> está instalado, vamos rodar nossa primeira análise. O FastQC gera relatórios gráficos (HTML) e tabelas (TXT) sobre a qualidade dos seus dados de sequenciamento.
</p>

<h3>2.1 Criando a estrutura do projeto</h3>

Crie uma pasta para organizar o teste e adicione um diretório de dados:

<pre>
mkdir -p ~/fastqc_tutorial/data
cd ~/fastqc_tutorial
</pre>

Coloque 1–2 arquivos FASTQ em <code>data/</code> (ou baixe algum exemplo público).

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

<h3>2.2 Rodando o FastQC</h3>

<p>
  Para rodar o FastQC você pode escolher entre duas formas:
</p>

<ul>
  <li>
    Usando o <strong>curinga *</strong> para analisar todos os arquivos FASTQ do diretório:
    <pre>
mkdir -p results
fastqc data/*.fastq.gz -o results/</pre>
  </li>
  <li>
    Ou indicando diretamente o nome de um arquivo específico:
    <pre>fastqc data/SEU_ARQUIVO.fastq.gz -o results/</pre>
  </li>
</ul>

<p>
  Em ambos os casos, será criado um diretório <code>results/</code> com os relatórios.  
  Você terá dois tipos de saída:
</p>

<ul>
  <li><strong>HTML</strong>: relatório interativo com gráficos (abra no navegador).</li>
  <li><strong>.zip</strong>: pacote com os resultados brutos (para análises automáticas).</li>
</ul>

Para descobrir o caminho exato onde estão os seus arquivos <code>.html</code>, digite no terminal:

<pre>pwd</pre>

A saída será algo parecido com isto:

![FastQC 1](/assets/img/fastqc/fastqc_1.png)

<blockquote class="info">
Se você estiver no Windows:  
Abra o <strong>File Explorer</strong> e clique no ícone do Linux na barra lateral esquerda.  
Depois, navegue pelas pastas até chegar em <code>home</code>.  
A partir daí, siga o caminho mostrado pelo comando <code>pwd</code> para localizar seus relatórios.
</blockquote>

<blockquote class="tip">
  Abra o arquivo <code>.html</code> no navegador e confira a qualidade dos seus dados antes de continuar para etapas de trimming, alinhamento ou montagem.
</blockquote>

<blockquote class="info">
Você ainda não sabe como interpretar os gráficos do FastQC? Não se preocupe! Você pode encontrar a explicação no nosso <a href="medium.com/#" target="_blank">medium - FASTQC</a>.
</blockquote>
---

# Conclusão

“Pão, pão; queijo, queijo”, como diria meu professor de português 
<a href="https://www.plataformadoxandao.com.br/" target="_blank">Alexandre Soares</a>. <br><br>
Você instalou o **FastQC** dentro de um ambiente **Conda** e rodou sua **primeira análise** em arquivos FASTQ.  
A partir de agora, já consegue avaliar a qualidade dos seus dados antes de avançar para etapas mais pesadas, como **trimming** (TrimGalore!, fastp), **alinhamento** (BWA, Bowtie2) ou integração dos relatórios com o **MultiQC**.

Até a próxima!  

<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaThteTQ3M3lyZTE2NmQ3bmd1aDZuaG5ybDQ4Mm1keHRheGhtdDg4NSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/VhWVAa7rUtT3xKX6Cd/giphy.gif" alt="gif" width="200" style="display:block; margin:auto;">

---

Se curtiu, dá aquele apoio no <a href="https://www.linkedin.com/in/christopher-lee-390643197/" target="_blank">LinkedIn</a> e considere um cafézinho ☕ para manter o projeto vivo. Valeu!

Pix: [biologolee@gmail.com](mailto:biologolee@gmail.com)<br>
Bitcoin: bc1qg7qrfhclzt3sm60en53qv8fmwpuacfaxt5v55k

![QR Code](/assets/img/meus_projetos/bluewallet_qrcode.png)

---

# Referências

1. <a href="https://www.bioinformatics.babraham.ac.uk/projects/fastqc/" target="_blank">Documentação oficial do FastQC</a>  
2. <a href="https://docs.conda.io/projects/conda/en/latest/index.html/" target="_blank">Conda</a>  
3. <a href="https://multiqc.info/" target="_blank">MultiQC</a>
