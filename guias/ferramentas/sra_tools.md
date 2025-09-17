---
layout: guia
title: Tutorial de instalação do SRA-Tools
permalink: /guias/ferramentas/sra_tools/
---

![SRA-TOOLS](/assets/img/sra_tools/sra-tools.png)

# <u>Tutorial de instalação do SRA-Tools</u>

<p style="text-align: justify">
  Fala pessoal, hoje eu vou mostrar pra vocês como instalar o <strong>SRA-Tools</strong> na máquina.  
  Quem já tentou baixar dados de sequenciamento do NCBI sabe que não é tão simples assim: clicar em “download” direto do site quase nunca funciona bem, principalmente quando os arquivos são gigantes.<br>
  É justamente aí que o SRA-Tools brilha. Ele permite puxar esses dados direto do servidor e já converter no formato certinho pra você usar nas análises.<br>
  Eu mesmo já tentei baixar arquivos manualmente e quase sempre dava problema ou quebrava no meio do download, ou vinha num formato meio inútil.<br>
  Com o SRA-Tools, você roda um comando simples e pronto, os dados já caem na sua máquina do jeito certo.
  Nesse tutorial eu vou te ensinar a instalar o SRA-Tools e fazer o seu primeiro download.<br>
  É tranquilo de configurar e, olha... economiza um tempo absurdo quando você precisa trabalhar com dados reais de DNA e RNA.
</p>

<img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDA0N3p0YXR5ejQ2c3RoazNhbmU5Zjl1eGZqOG90M3F0MWJ1aWNpcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bhQ0fEHzUKLCjnqUUD/giphy.gif" alt="gif" width="220" style="display:block; margin:auto;">

O que você vai precisar <u>antes</u>:

- **Conda** — [instalação aqui](/guias/ambientes/anaconda/)  
- **WSL/Linux** — [tutorial aqui](/guias/plataforma/wsl)  
- **SRA-Tools** — útil para baixar FASTQs públicos ([guia](/guias/ferramentas/sra-tools))  

---

# <u>O que é o SRA-Tools?</u>

<p style="text-align: justify">
  O <strong>SRA-Tools</strong> é um conjunto de ferramentas desenvolvido pelo NCBI que permite baixar, manipular e converter dados do 
  <span class="tooltip"><strong>Sequence Read Archive (SRA)</strong>
    <span class="tooltiptext">Maior repositório público de dados de sequenciamento genômico do mundo.</span>
  </span>.
</p>

<p style="text-align: justify">
  Com ele, você consegue pegar dados brutos de DNA/RNA diretamente da base do NCBI e transformar em formatos mais práticos, como FASTQ, para depois analisar em pipelines de bioinformática.
</p>

<p style="text-align: justify">
  Na prática, o SRA-Tools é tipo a “ponte” entre os dados públicos de sequenciamento e a sua análise local.  
  Seja para montar genomas, rodar metagenômica, RNA-Seq ou testar pipelines, ele é sempre o primeiro passo quando o assunto é buscar dados reais.
</p>

---

## Passo a passo
1. [Baixando](#baixando)  
2. [Instalando](#instalando)  
3. [Procurando arquivos no SRA](#sra)  
4. [O kit que você precisa para sobreviver ao SRA-Tools](#kit-sra-tools)

---

<h2 id="baixando">1. Baixando</h2>

<p style="text-align: justify">
Antes de começar, você vai precisar do kit básico de sobrevivência do bioinformata: ter o <a href="/guias/ambientes/anaconda/" target="_blank">Bioconda</a> instalado.  
Se estiver no Windows, será necessário trabalhar com o <a href="/guias/plataforma/wsl/" target="_blank">WSL</a>.  
Os tutoriais estão disponíveis nesses links: <a href="/guias/plataforma/wsl/" target="_blank">WSL</a> e <a href="/guias/ambientes/anaconda/" target="_blank">Miniconda</a>.
</p>

<p>
Tendo o WSL e o Miniconda instalados, a gente pode prosseguir para a instalação.
</p>

![S_1](/assets/img/sra_tools/s_1.png)

Crie um ambiente no Conda:

<pre>conda create -n (nome_do_seu_ambiente)</pre>

![S_2](/assets/img/sra_tools/s_2.png)

Ative o ambiente criado:

<pre>conda activate (nome_do_seu_ambiente)</pre>

---

## O que é o Bioconda?

![S_3](/assets/img/sra_tools/s_3.png)

<p style="text-align: justify">
O <strong>Bioconda</strong> é um repositório de pacotes do Conda voltado para bioinformática.  
Ele reúne milhares de ferramentas já compiladas e prontas para instalar com um simples comando, sem complicação de dependências.  
É a forma mais prática de montar ambientes de análise em biociência.
</p>

<p>
Para baixar um pacote do Bioconda, basta acessar o repositório desejado e usar o comando indicado.
</p>

---

<h2 id="instalando">2. Instalando</h2>

![S_4](/assets/img/sra_tools/s_4.png)

Instale o SRA-Tools no ambiente ativo:

<pre>conda install bioconda::sra-tools</pre>

![S_5](/assets/img/sra_tools/s_5.png)

<p>Pronto! O seu <strong>SRA-Tools</strong> está instalado!</p>

---

<h2 id="sra">3. Procurando arquivos no SRA</h2>

![S_6](/assets/img/sra_tools/s_6.png)

Agora com o ambiente configurado, visite o site oficial do  
<a href="https://www.ncbi.nlm.nih.gov/sra" target="_blank">SRA (NCBI)</a>.

![S_7](/assets/img/sra_tools/s_7.png)  
No campo de pesquisa, procure por algo como <em>metagenomics 16S soil</em>.  
Você pode usar sua criatividade para procurar outros tipos de estudo: <em>metagenomic 16S gut</em>, <em>metagenomic shotgun gut</em>, <em>transcriptomic</em>, etc.

![S_8](/assets/img/sra_tools/s_8.png)  
Para fins práticos, escolha um resultado pequeno (ex.: 36 MB).  
Não se preocupe se o mesmo estudo não aparecer para você, pode usar qualquer um leve.

![S_9](/assets/img/sra_tools/s_9.png)  
Ao clicar em <strong>RUN</strong>, você verá os detalhes da amostra.

![S_10](/assets/img/sra_tools/s_10.png)  
Copie o código da corrida (ex.: <u>SRR35046182</u>).

---

<h2 id="kit-sra-tools">4. O kit básico que você precisa para sobreviver ao SRA-Tools</h2>

![S_12](/assets/img/sra_tools/s_12.png)

Baixe o arquivo usando o comando:

<pre>prefetch SRR35046182</pre>

<blockquote class="warning">
Versões antigas do <code>SRA-Tools</code> (ex.: 2.9.x) podem gerar erros de conexão TLS/SSL ao usar <code>prefetch</code> ou <code>fastq-dump</code>.  
Antes de usar, confira sua versão com:  

<pre><code>prefetch -V</code></pre>

Para desinstalar a versão antiga basta digitar:
<pre><code>conda remove sra-tools</code></pre>

Para instalar a versão mais nova no mesmo ambiente basta digitar:
<pre><code>conda install -c bioconda -c conda-forge sra-tools -y</code></pre>
</blockquote>

![S_11](/assets/img/sra_tools/s_11.png)  
Se a amostra for paired-end, use o comando para separar os arquivos:

![S_13](/assets/img/sra_tools/s_13.png)

<pre>fastq-dump --gzip --split-files SRR35046182/SRR35046182</pre>

<p>
Pronto! Agora que você tem os arquivos descompactados e separados, pode começar a fazer a análise com as ferramentas de controle de qualidade 
<a href="/guias/qualidade/fastqc/" target="_blank">FastQC</a>, 
<a href="/guias/trimmagem/fastp/" target="_blank">Fastp</a> e 
<a href="/guias/qualidade/falco/" target="_blank">Falco</a>.
</p>

---

<img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjFtYTdqaDk2YWU1MTRxemtvcHA2YTZub3pqamZxb2psbW9oMGM1YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WY22qampr5P4QDD9ld/giphy.gif" alt="gif" width="220" style="display:block; margin:auto;">

<p style="text-align: justify">
Fala sério! Esse tutorial é bem mais tranquilo que os outros, né?  
Viu como a bioinformática não é um bicho de sete cabeças?  
Brincadeira... às vezes é sim 😅, mas nada que a gente não possa resolver!  
O segredo é não desanimar e estudar sempre. Stay focus!!
</p>

---

Dê um suporte ao meu projeto. Doe um cafézinho ☕.<br>
Pix: biologolee@gmail.com<br>
Bitcoin: bc1qg7qrfhclzt3sm60en53qv8fmwpuacfaxt5v55k

![QR Code](/assets/img/meus_projetos/bluewallet_qrcode.png)

---

# Referências

1. <a href="https://anaconda.org/bioconda/sra-tools" target="_blank">SRA-Tools no Bioconda</a>  
2. <a href="https://www.ncbi.nlm.nih.gov/sra" target="_blank">SRA NCBI</a>
