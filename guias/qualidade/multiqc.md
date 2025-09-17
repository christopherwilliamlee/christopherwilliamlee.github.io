---
layout: guia
title: Tutorial de instalação do MultiQC (Conda)
permalink: /guias/qualidade/multiqc/
---

![MultiQC logo](/assets/img/multiqc/multiqc_logo.png)

# <u>Instalação do MultiQC com Conda</u>

<p style="text-align: justify">
  Fala, galera! Depois de rodar ferramentas de controle de qualidade como o 
  <a href="/guias/qualidade/fastqc/" target="_blank">
    <span class="tooltip"><strong>FastQC</strong>
      <span class="tooltiptext">Ferramenta clássica para avaliar a qualidade de arquivos FASTQ.</span>
    </span>
  </a> 
  ou o 
  <a href="/guias/qualidade/falco/" target="_blank">
    <span class="tooltip"><strong>Falco</strong>
      <span class="tooltiptext">Ferramenta rápida para avaliação em lote de arquivos FASTQ.</span>
    </span>
  </a>, 
  você acaba com uma pilha de relatórios separados.  
  Navegar um por um pode ser trabalhoso e pouco prático quando o número de arquivos cresce.
</p>

<p style="text-align: justify">
  É aí que entra o 
  <a href="https://multiqc.info/" target="_blank">
    <span class="tooltip"><strong>MultiQC</strong>
      <span class="tooltiptext">Ferramenta que reúne múltiplos relatórios de bioinformática em um único resumo interativo.</span>
    </span>
  </a>.  
  Ele varre automaticamente um diretório inteiro, detecta relatórios de diversas ferramentas de NGS 
  como <strong>FastQC</strong>, <strong>Falco</strong>, <strong>STAR</strong>, <strong>Salmon</strong>, <strong>Bismark</strong>, entre muitas outras,
  e gera um 
  <span class="tooltip"><strong>único relatório consolidado em HTML</strong>
    <span class="tooltiptext">Um painel interativo que resume todos os resultados em um só lugar.</span>
  </span>.
</p>

<p style="text-align: justify">
  Ou seja: em vez de abrir dezenas de arquivos diferentes, você tem tudo integrado e visual em um só clique.  
  Resumindo: o MultiQC é como aquele “puxadinho inteligente” que organiza a bagunça dos relatórios espalhados e entrega tudo de forma clara e prática.
</p>

---

## O que você vai precisar <u>antes</u>:

- **Conda** — confira o <a href="/guias/ambientes/anaconda/" target="_blank">tutorial de instalação</a>.  
- **WSL** — se você usa Windows, veja o <a href="/guias/plataforma/wsl/" target="_blank">passo a passo</a>.  
- **Relatórios de qualidade** — você vai precisar ter arquivos já processados pelo <a href="/guias/qualidade/fastqc/" target="_blank">FastQC</a> ou pelo <a href="/guias/qualidade/falco/" target="_blank">Falco</a>. O MultiQC não lê arquivos <code>.fastq.gz</code> brutos, apenas os relatórios que essas ferramentas geram. Caso ainda não saiba como obtê-los, confira os tutoriais de cada ferramenta.

Neste guia, <u>você vai</u>:

- Criar um ambiente Conda e instalar o **MultiQC**;  
- Rodar sua primeira análise consolidando relatórios do **FastQC** e do **Falco**;  
- Visualizar os resultados em um relatório interativo.  

<img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnY4YW41N3FhdzV0aGt4dTJnc3ljcWZwMHI0eHA1YWg1em13eW42YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ju097uUw2kpppcXllI/giphy.gif" alt="gif" width="200" style="display:block; margin:auto;">

---

## Passo a passo

1. [Instalação](#instalacao)  
2. [Rodando com FastQC](#analise-fastqc)  
3. [Rodando com Falco](#analise-falco)

<h2 id="instalacao">1. Criando o ambiente e instalando o MultiQC</h2>

<p>
  O MultiQC é distribuído pelo <strong>bioconda</strong>, então a instalação é simples.
</p>

<pre>
conda create -n multiqc-env -c bioconda -c conda-forge multiqc -y
conda activate multiqc-env
</pre>

<blockquote class="info">
  Esse passo é recomendado porque:<br>  
  • mantém o ambiente do sistema limpo;<br>  
  • garante que todos terão as mesmas versões das ferramentas;<br>  
  • facilita repetir a análise em qualquer máquina.
</blockquote>

<p>
  Depois de ativar o ambiente, confirme se o MultiQC está funcionando:
</p>

<pre>
multiqc --version
</pre>

<p>
Saída esperada:
</p>

<pre>
multiqc, version X.X
</pre>

---

<h2 id="analise-fastqc">2. Exemplo com FastQC</h2>

<p>
  Se você já rodou o <strong>FastQC</strong>, a estrutura de saída padrão contém pastas como <code>sample_fastqc/</code> ou arquivos <code>*_fastqc.zip</code>.  
  O MultiQC reconhece isso automaticamente:
</p>

<pre>
mkdir -p multiqc_report
multiqc results/ -o multiqc_report/
</pre>

<ul>
  <li><code>results/</code>: pasta com relatórios gerados pelo FastQC.</li>
  <li><code>-o multiqc_report/</code>: define a pasta onde será salvo o relatório final.</li>
</ul>

<p>
  O MultiQC cria um arquivo <code>multiqc_report.html</code> que pode ser aberto no navegador, reunindo todas as métricas em gráficos interativos.
</p>

![MultiQC 1](/assets/img/multiqc/multiqc_1.png)

---

<h2 id="analise-falco">3. Exemplo com Falco</h2>

<p>
  O <strong>Falco</strong> gera relatórios compatíveis com o FastQC (<code>fastqc_data.txt</code>, <code>summary.txt</code>, <code>fastqc_report.html</code>).  
  Porém, por padrão, o MultiQC só reconhece esses arquivos se estiverem no formato do FastQC: <strong>dentro de pastas <code>*_fastqc/</code></strong> (ou como <code>*_fastqc.zip</code>).
</p>

<h3>Para corrigir isso você precisa seguir esses passos:</h3>

<p>Crie e edite o arquivo <code>multiqc_config.yaml</code> com o comando:</p>

<pre>
nano multiqc_config.yaml
</pre>

<p>Dentro dele, insira o seguinte conteúdo:</p>

<pre>
sp:
  fastqc/data:
    fn: "*_fastqc_data.txt"
  fastqc/zip:
    fn: "*_fastqc.zip"
</pre>

<ul>
  <li><code>sp:</code> início da configuração (<em>search patterns</em>) que informa ao MultiQC como localizar arquivos.</li>
  <li><code>fastqc/data:</code> define um grupo chamado “data” para arquivos de saída do FastQC/Falco.</li>
  <li><code>fn: "*_fastqc_data.txt"</code> padrão (glob) que localiza todos os arquivos terminados em <code>_fastqc_data.txt</code>.</li>
  <li><code>fastqc/zip:</code> define outro grupo, agora para arquivos compactados.</li>
  <li><code>fn: "*_fastqc.zip"</code> padrão que localiza todos os arquivos <code>.zip</code> de relatórios do FastQC.</li>
</ul>


<blockquote class="tip">
No editor nano:<br>
• <code>CTRL + O</code> e depois <code>Y</code> para salvar<br>
• <code>CTRL + X</code> para sair
</blockquote>

<p>Depois rode o comando:</p>

<pre>
multiqc results/ -o multiqc_report/ -c multiqc_config.yaml -m fastqc -v
</pre>


<blockquote class="warning">
O MultiQC <strong>não</strong> lê arquivos <code>.fastq.gz</code> brutos, apenas relatórios de QC (ex.: FastQC/Falco).  
Aponte sempre para as <em>saídas</em>, não para os FASTQ.
</blockquote>

---

## Conclusão

<p>
Chegamos ao fim!  
Você montou um ambiente Conda, instalou o MultiQC e aprendeu a transformar relatórios do FastQC e do Falco em um único arquivo interativo.
</p>

<p>
A grande sacada do MultiQC é a praticidade: ele coleta informações espalhadas e entrega um panorama claro e organizado, pronto para ser discutido com a equipe ou incluído em relatórios científicos.
</p>

<p>
De agora em diante, sempre que rodar análises de qualidade ou alinhamento, lembre-se: em vez de abrir arquivo por arquivo, basta um comando e você terá a visão completa do projeto.
</p>

<p>
Até a próxima!
</p>

<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzFla3U2MzVqMTU4MGozcHBnM2FsYmw0Z2hnOWEwM2plMDJ5bWJheiZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/duNowzaVje6Di3hnOu/giphy.gif" alt="gif" width="200" style="display:block; margin:auto;">

<p>
Se curtiu, dá aquele apoio no <a href="https://www.linkedin.com/in/christopher-lee-390643197/" target="_blank">LinkedIn</a>
</p>

---

# Referências 

1. <a href="https://multiqc.info/" target="_blank">MultiQC — site oficial</a>