---
layout: guia
title: Tutorial de instalação do Nextflow
permalink: /guias/ambientes/nextflow/
---

![Nextflow logo](/assets/img/nextflow/nextflow_logo.png)

# <u>Instalação do Nextflow + primeiro workflow (FastQC)</u>

<p>
  Fala, galera! Bora colocar o
  <a href="https://www.nextflow.io/" target="_blank">
    <span class="tooltip">Nextflow
      <span class="tooltiptext">Plataforma para criar e executar workflows científicos.</span>
    </span>
  </a>
  pra rodar? <br><br>
  Se você trabalha com bioinformática, cedo ou tarde vai querer
  <span class="tooltip">automatizar suas análises
    <span class="tooltiptext">Organizar as etapas em um fluxo único, sem rodar comandos soltos manualmente.</span>
  </span>.  
  O <span class="badge badge--nextflow">Nextflow</span> é aquele
  <span class="tooltip">motor de workflow
    <span class="tooltiptext">Um sistema que conecta etapas de análise, controla dependências e executa em ordem.</span>
  </span>
  que liga suas etapas,
  <span class="tooltip">paraleliza
    <span class="tooltiptext">Executa várias etapas ao mesmo tempo, aproveitando múltiplos núcleos da CPU.</span>
  </span>,
  cuida de
  <span class="tooltip">arquivos temporários
    <span class="tooltiptext">Arquivos intermediários criados entre etapas, descartados automaticamente quando não são mais necessários.</span>
  </span>
  e deixa tudo <strong>reprodutível</strong> e <strong>organizado</strong>, seja no seu notebook, no WSL, em servidores ou na nuvem.
</p>

<p><u>Neste guia, você vai:</u></p>

<ul>
  <li>Instalar o <span class="badge badge--nextflow">Nextflow</span> rapidinho (WSL/Linux/macOS);</li>
  <li>Entender o que é um workflow;</li>
  <li>Criar <strong>seu primeiro pipeline</strong> usando o <strong>FastQC</strong> como exemplo.</li>
</ul>

<img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnh2ajFvdjRrZXMwbzlsb3RqaTYwaXVjMXo2cndjZnVjZTRyeXd3cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/nn8uzAnxuchf2OWXNy/giphy.gif"
     alt="Animação ilustrando um pipeline encadeado (workflow) rodando"
     width="200"
     style="display:block; margin:auto;">

<code class="codeStyle">
  A ideia é essa: cada etapa é um <em>passo</em> e o Nextflow coordena tudo.
</code>

---

# O que é o Nextflow?

<p>
  O <a href="https://www.nextflow.io/" target="_blank">Nextflow</a> é um 
  <span class="tooltip">gerenciador de workflows
    <span class="tooltiptext">Programa que organiza e executa várias etapas de uma análise científica.</span>
  </span>
  criado especialmente para dados científicos e bioinformática.
</p>

<ul>
  <li>
    Em vez de rodar comandos soltos no terminal, você descreve cada etapa como um 
    <span class="tooltip"><strong>processo</strong>
      <span class="tooltiptext">Bloco que executa uma tarefa (ex.: rodar o FastQC) com script, recursos e, se quiser, container.</span>
    </span>.
  </li>
  <li>
    Os dados circulam por 
    <span class="tooltip"><strong>canais</strong>
      <span class="tooltiptext">Fluxos que carregam valores/arquivos entre processos, garantindo a ordem correta.</span>
    </span>; cada processo declara seus 
    <span class="tooltip"><em>inputs</em>
      <span class="tooltiptext">Arquivos/valores de entrada (ex.: FASTQ bruto).</span>
    </span> e 
    <span class="tooltip"><em>outputs</em>
      <span class="tooltiptext">Arquivos/valores de saída (ex.: relatório de qualidade).</span>
    </span>. O <span class="badge badge--nextflow">Nextflow</span> conecta tudo automaticamente formando um 
    <span class="tooltip"><a href="https://nextflow.io/docs/latest/developer/nextflow.dag.html" target="_blank"><em>DAG</em></a>
      <span class="tooltiptext">Grafo Acíclico Direcionado: representa as etapas (nós) e suas dependências (arestas) sem ciclos.</span>
    </span> do pipeline.

  </li>
  <li>
    Ele executa etapas em 
    <span class="tooltip">paralelo
      <span class="tooltiptext">Aproveita vários núcleos/recursos conforme dependências permitem.</span>
    </span>, economiza tempo e permite trocar facilmente o 
    <span class="tooltip"><strong>ambiente de execução</strong>
      <span class="tooltiptext">Local (seu computador), Conda, Docker/Singularity, HPC ou nuvem.</span>
    </span>.
  </li>
  <li>
    É focado em 
    <span class="tooltip"><strong>reprodutibilidade</strong>
      <span class="tooltiptext">Mesma análise, mesmos resultados, em qualquer ambiente.</span>
    </span> e 
    <span class="tooltip"><strong>portabilidade</strong>
      <span class="tooltiptext">Mesmo pipeline roda em diferentes máquinas sem reescrita.</span>
    </span>. Possui cache de resultados e o famoso 
    <code style="background:#2d2d2d; border-radius:6px; padding:2px 6px;">-resume</code>, que reaproveita etapas já concluídas.
  </li>
</ul>


---

## Passo a passo
1. [Instalação](#instalacao)
2. [Seu primeiro workflow (FastQC)](#workflow)
3. [Explicação do código](#explicacao-do-codigo)

---

<h2 id="instalacao">1. Instalando o Nextflow</h2>

<p>
  Antes de instalar o <span class="badge badge--nextflow">Nextflow</span>, precisamos do 
  <span class="tooltip"><strong>Java</strong>
    <span class="tooltiptext">Linguagem de programação usada pelo <span class="badge badge--nextflow">Nextflow</span> para funcionar.</span>
  </span>. 
  A versão mínima é o Java 11, mas recomendo usar o <strong>Java 17</strong> para maior compatibilidade.
</p>

<blockquote class="info">
  Se você já tiver o Java 11 ou 17 instalado, pode pular este passo.
  Para verificar, rode no terminal:
  <pre>java -version</pre> 
</blockquote>

<h3>1.1 Instalando o Java (WSL/Ubuntu)</h3>

<p>No WSL/Ubuntu, execute:</p>
<pre>sudo apt update
sudo apt install -y openjdk-17-jre</pre>

<p>Verifique a instalação:</p>
<pre>java -version</pre>

<p>Saída esperada (algo como):</p>
<code style="display:inline-block; background:#2d2d2d; color:#e1e1e1; border-radius:6px; padding:8px 12px; white-space:pre; line-height:1.4;">openjdk version "17.x.x" 2025-XX-XX
OpenJDK Runtime Environment (build 17.0.x+XX-Ubuntu-XX)
OpenJDK 64-Bit Server VM (build 17.0.x+XX-Ubuntu-XX, mixed mode, sharing)
</code>

<div class="table-wrap">
  <table>
    <thead>
      <tr>
        <th>Comando</th>
        <th>Descrição</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code class="codeStyle">sudo apt update</code></td>
        <td>Atualiza a lista de pacotes disponíveis no Ubuntu.</td>
      </tr>
      <tr>
        <td><code class="codeStyle">sudo apt install -y openjdk-17-jre</code></td>
        <td>Instala o Java 17 (JRE). A flag <code class="codeStyle">-y</code> confirma automaticamente.</td>
      </tr>
      <tr>
        <td><code class="codeStyle">java -version</code></td>
        <td>Mostra a versão instalada do Java (para confirmar que deu certo).</td>
      </tr>
    </tbody>
  </table>
</div>

<h3>1.2 Instalando o Nextflow</h3>

<p>
  Agora que já temos o Java, podemos instalar o <span class="badge badge--nextflow">Nextflow</span>. 
  A forma mais prática é via um script oficial que baixa o binário pronto.
</p>

<p>Rode no terminal:</p>
<pre>curl -s https://get.nextflow.io | bash</pre>

<p>
  Isso gera um arquivo chamado <span class="badge badge--nextflow">Nextflow</span> no diretório atual.
  Para deixar disponível em qualquer lugar do sistema, mova-o para uma pasta do seu <em>PATH</em> (ex.: <code class="codeStyle">~/bin</code>):
</p>

<pre>mkdir -p ~/bin
mv nextflow ~/bin/
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc</pre>

<p>Teste para ver se funcionou:</p>
<pre>nextflow -version</pre>

<p>Saída esperada (algo como):</p>
<code style="display:inline-block; background:#000000; color:#e1e1e1; border-radius:6px; padding:5px 12px; white-space:pre; line-height:1.4;">N E X T F L O W
version 25.04.6 build 5954
created 01-07-2025 11:27 UTC (08:27 BRST)
cite doi:10.1038/nbt.3820
http://nextflow.io
</code>

<blockquote class="tip">
  Se você já usa o <span class="badge badge--nextflow">conda</span>, também pode instalar o <span class="badge badge--nextflow">Nextflow</span> assim:<br>
   <pre>conda install -c bioconda -c conda-forge nextflow</pre>
  <blockquote class="warning">
    Essa opção é prática, mas a instalação via script oficial costuma ser mais estável em ambientes mistos (local, HPC, nuvem).
  </blockquote>
</blockquote>

<blockquote class="info">
  <strong>Observação:</strong> Se você usa <code class="codeStyle">zsh</code> em vez de <code class="codeStyle">bash</code>, substitua <code class="codeStyle">~/.bashrc</code> por <code class="codeStyle">~/.zshrc</code> ao ajustar o <em>PATH</em>.
  Para atualizar o <span class="badge badge--nextflow">Nextflow</span> no futuro: <code class="codeStyle">nextflow self-update</code>.
</blockquote>

<div class="table-wrap">
  <table>
    <thead>
      <tr>
        <th>Comando</th>
        <th>Descrição</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code class="codeStyle">curl -s https://get.nextflow.io | bash</code></td>
        <td>Baixa e executa o instalador oficial do <span class="badge badge--nextflow">Nextflow</span>.</td>
      </tr>
      <tr>
        <td><code class="codeStyle">mkdir -p ~/bin</code></td>
        <td>Cria a pasta <code class="codeStyle">~/bin</code> se não existir.</td>
      </tr>
      <tr>
        <td><code class="codeStyle">mv nextflow ~/bin/</code></td>
        <td>Move o executável <code class="codeStyle">nextflow</code> para <code class="codeStyle">~/bin</code>.</td>
      </tr>
      <tr>
        <td><code class="codeStyle">echo 'export PATH="$HOME/bin:$PATH"' &gt;&gt; ~/.bashrc</code></td>
        <td>Adiciona <code class="codeStyle">~/bin</code> ao <em>PATH</em> de forma permanente (para bash).</td>
      </tr>
      <tr>
        <td><code class="codeStyle">source ~/.bashrc</code></td>
        <td>Recarrega o arquivo de configuração para ativar o <em>PATH</em> atualizado.</td>
      </tr>
      <tr>
        <td><code class="codeStyle">nextflow -version</code></td>
        <td>Verifica se o <span class="badge badge--nextflow">Nextflow</span> foi instalado corretamente.</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 id="workflow">2. Seu primeiro workflow (FastQC)</h2>

<p>
  Agora que o <span class="badge badge--nextflow">Nextflow</span> está instalado, vamos criar o nosso
  <span class="tooltip">primeiro workflow
    <span class="tooltiptext">Um encadeamento de etapas automatizadas para processar dados.</span>
  </span>.  
  Vamos usar o <strong>FastQC</strong>, que gera relatórios de qualidade de arquivos FASTQ.
</p>

<blockquote class="info">
Se você nunca instalou o FASTQC, você pode acessar o tutorial aqui: <a href="/guias/qualidade/fastqc" target="_blank">Tutorial FASTQC</a>
</blockquote>

<h3>2.1 Criando a estrutura do projeto</h3>

<p>Crie uma pasta para o workflow e um diretório de dados:</p>
<pre>mkdir -p ~/nextflow_tutorial
cd ~/nextflow_tutorial</pre>

<h3>2.1.1 Ambiente isolado + download da SRA (recomendado)</h3>

<p style="align-text: justify">
  Antes de escrever o código, vamos preparar o ambiente que vai rodar o pipeline.  
  Em vez de instalar ferramentas direto no sistema, vamos criar um <strong>ambiente</strong>
  <a href="/guias/ferramentas/sra_tools/" target="_blank">
    <span class="tooltip">Conda
      <span class="tooltiptext">Tutorial Conda.</span>
    </span>
  </a>
  exclusivo com o <strong>FastQC</strong> e o 
  <a href="/guias/ferramentas/sra_tools/" target="_blank">
    <span class="tooltip">SRA-Tools
      <span class="tooltiptext">Tutorial SRA-Tools.</span>
    </span>
  </a>.  
  Isso garante isolamento, evita conflitos de versão e deixa o projeto reprodutível.
</p>

<pre>conda create -n nf-fastqc-sra -c bioconda -c conda-forge fastqc sra-tools -y
conda activate nf-fastqc-sra</pre>

<blockquote class="info">
  Esse passo é recomendado porque:<br>
  • mantém o ambiente do sistema limpo;<br>
  • garante que todos os usuários terão as mesmas versões das ferramentas;<br>
  • facilita a repetição do pipeline em qualquer máquina.
</blockquote>

<p style="align-text: justify">
  O pipeline do próximo passo (<strong><a href="#nextflow_tut.nf">2.2 Criando o arquivo nextflow_tut.nf</a></strong>) aceita <em>duas formas de entrada</em>:
  você pode <strong>baixar uma amostra do SRA</strong> informando <code class="codeStyle">--srr &lt;SRR_ID&gt;</code> (ex.: <code class="codeStyle">SRR34840432</code>)
  <em>ou</em> usar <strong>seus próprios FASTQs locais</strong> com <code class="codeStyle">--fastq &lt;DIR&gt;</code> (padrão de arquivos <code class="codeStyle">*_1.fastq.gz</code> e <code class="codeStyle">*_2.fastq.gz</code>).
  Esses modos são <strong>mutuamente exclusivos</strong>, <strong style="color: red">escolha apenas um por execução</strong>, permitindo decidir na hora se vai trabalhar com dados públicos do SRA ou com arquivos que você já possui.
</p>

<blockquote class="tip">
  Dessa forma, você pode trocar facilmente o número de acesso sem editar o código. Basta rodar o comando acima com outro <code class="codeStyle">SRR</code>.
</blockquote>

<h3>2.1.2 Preparando os dados (FASTQ local)</h3>

<p>Se você já tem FASTQs locais, coloque-os em <code class="codeStyle">data/</code> no padrão <code class="codeStyle">*_1.fastq.gz</code> e <code class="codeStyle">*_2.fastq.gz</code>:</p>
<pre>mkdir -p data
# copie ou mova seus arquivos *_1.fastq.gz e *_2.fastq.gz para data/</pre>

<blockquote class="info">
  O pipeline exige arquivos <code class="codeStyle">.fastq.gz</code> pareados.  
  Se estiverem descompactados (<code class="codeStyle">.fastq</code>), compacte:
</blockquote>
<pre>gzip data/*_1.fastq data/*_2.fastq</pre>

<h3 id="nextflow_tut.nf">2.2 Criando o arquivo nextflow_tut.nf</h3>

Esse será o “coração” do pipeline. Crie:

<pre>nano nextflow_tut.nf</pre>

<blockquote class="info">
  O nextflow_tut.nf é o arquivo principal do <span class="badge badge--nextflow">Nextflow</span>.  
  É nele que você descreve os
  <span class="tooltip">processos
    <span class="tooltiptext">Blocos de código que executam uma tarefa específica (ex.: rodar o FastQC).</span>
  </span>,
  os
  <span class="tooltip">canais
    <span class="tooltiptext">Caminhos de dados que ligam a saída de um processo à entrada de outro.</span>
  </span>
  e o
  <span class="tooltip">workflow
    <span class="tooltiptext">Sequência lógica que conecta todos os processos.</span>
  </span>.  
  O nextflow_tut.nf funciona como o roteiro do pipeline: nele você define quais dados entram (inputs) e quais etapas de análise devem ser executadas (processos), além de como esses passos se conectam.
</blockquote>

Cole o conteúdo abaixo:

<pre>
// nextflow_tut.nf — pipeline com SRA + FastQC
// DSL2
nextflow.enable.dsl=2

// -------------------- Parâmetros --------------------
params.srr    = null
params.fastq  = null
params.outdir = null
params.help   = false

// -------------------- Ajuda --------------------
def helpMessage() {
    log.info """
    ======================================================
     Pipeline Nextflow: Download SRA + FastQC
    ======================================================
    Uso:
      nextflow run nextflow_tut.nf --fastq &lt;dir&gt; --outdir &lt;dir&gt;
      nextflow run nextflow_tut.nf --srr &lt;SRR&gt;   --outdir &lt;dir&gt;

    Parâmetros:
      --fastq   Diretório com FASTQs (espera *_1.fastq.gz e *_2.fastq.gz)
      --srr     Acessão SRA (ex.: SRR34840432)
      --outdir  Saída do FastQC
      --help    Mostra esta mensagem
    """
}

if (params.help) { helpMessage(); System.exit(0) }

// -------------------- Utils --------------------
// Verifica se existem pares *_1.fastq.gz e *_2.fastq.gz no diretório
def requireGzipPairs(String dirPath) {
  def dir = new File(dirPath)
  if (!dir.exists() || !dir.isDirectory())
    error "Diretório não encontrado: ${dirPath}"

  def names = (dir.listFiles() ?: [])
      .collect { it.name }
      .findAll { it ==~ /.+_(1|2)\.fastq\.gz$/ }

  if (!names || names.isEmpty())
    error "Os arquivos têm que estar compactados (.fastq.gz) no padrão *_1.fastq.gz e *_2.fastq.gz em ${dirPath}."

  def bases = names.collect { it.replaceFirst(/_(1|2)\.fastq\.gz$/, '') }.unique()
  def hasPair = bases.any { base ->
    new File(dir, "${base}_1.fastq.gz").exists() && new File(dir, "${base}_2.fastq.gz").exists()
  }

  if (!hasPair)
    error "Arquivos .fastq.gz encontrados, mas **sem par** correspondente *_1/_2 em ${dirPath}."

  return true
}

// -------------------- Processos --------------------

// 1) Prefetch (cache local do SRA); emite apenas o SRR para o próximo passo
process DOWNLOAD_SRA {
  // Rótulo da tarefa com o ID da amostra (srr) de --srr (SRA) ou do par FASTQ (local)
  tag "${srr}"

  input:
  val srr

  output:
  val srr

  script:
  """
  prefetch ${srr}
  """
}

// 2) Converter SRA -> FASTQ(.gz) com fasterq-dump
process SRA_TO_FASTQ {
  tag "${srr}"

  input:
  val srr

  output:
  tuple val(srr), path("${srr}_*.fastq.gz")

  script:
  """
  # Gera FASTQs e compacta
  fasterq-dump ${srr} -O . --split-files
  pigz -f ${srr}_1.fastq || gzip -f ${srr}_1.fastq
  pigz -f ${srr}_2.fastq || gzip -f ${srr}_2.fastq || true
  """
}

// 3) FastQC — recebe (srr, [R1,R2])
process FASTQC {
  tag "${srr}"

  publishDir { "${params.outdir}/${srr}" }, mode: 'copy', overwrite: true

  input:
  tuple val(srr), path(reads)

  output:
  path "*.html"
  path "*.zip"

  script:
  """
  fastqc -o . ${reads}
  """
}

// -------------------- Workflow --------------------
workflow {
  if (params.fastq) {
    log.info "Modo: FASTQ local"
    log.info "FASTQ dir: ${params.fastq}"

    // ---- Verificação de gzip ----
    requireGzipPairs(params.fastq as String)

    // Só depois cria a channel:
    fastq_ch = Channel.fromFilePairs("${params.fastq}/*_{1,2}.fastq.gz")

    FASTQC(fastq_ch)
  }
  else if (params.srr) {
    log.info "Modo: SRA"
    log.info "Iniciando pipeline com SRR: ${params.srr}"

    srr_ch   = Channel.of(params.srr)
    cached   = DOWNLOAD_SRA(srr_ch)
    fastq_ch = SRA_TO_FASTQ(cached)

    FASTQC(fastq_ch)
  }
  else {
    error "Forneça --fastq &lt;dir&gt; (FASTQ local) ou --srr &lt;ID&gt; (SRA). Use --help para ajuda."
  }
}
</pre>

<p>
  Esse pipeline está dividido em três partes principais: 
  <strong>parâmetros e validações</strong>, 
  <strong>processos</strong> e o <strong>workflow</strong>.
</p>

<div class="table-wrap">
  <table>
    <thead>
      <tr>
        <th>Elemento</th>
        <th>Descrição</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code class="codeStyle">params.fastq</code></td>
        <td>
          Diretório com FASTQs <code class="codeStyle">*.fastq.gz</code> pareados (<code class="codeStyle">*_1</code> e <code class="codeStyle">*_2</code>) para o modo local.
        </td>
      </tr>
      <tr>
        <td><code class="codeStyle">params.srr</code></td>
        <td>
          ID de acesso 
          <span class="tooltip"><strong>SRA</strong>
            <span class="tooltiptext">Sequence Read Archive: repositório público de leituras de sequenciamento.</span>
          </span> para o modo de download (SRA).
        </td>
      </tr>
      <tr>
        <td><code class="codeStyle">params.outdir</code></td>
        <td>Diretório de saída. Organiza os relatórios do FastQC por amostra sem precisar editar o código.</td>
      </tr>
      <tr>
        <td><code class="codeStyle">params.help</code></td>
        <td>Mostra a mensagem de uso (<code class="codeStyle">--help</code>) e encerra.</td>
      </tr>
      <tr>
        <td><strong>helpMessage()</strong></td>
        <td>Função que centraliza o guia de uso dos dois modos (local e SRA).</td>
      </tr>
      <tr>
        <td><code class="codeStyle">requireGzipPairs(dir)</code></td>
        <td>
          Verificação no modo <code class="codeStyle">--fastq</code>: exige pares <code class="codeStyle">*.fastq.gz</code> (<code class="codeStyle">*_1</code> e <code class="codeStyle">*_2</code>);
          aborta se não encontrar pares válidos.
        </td>
      </tr>
      <tr>
        <td><code class="codeStyle">process DOWNLOAD_SRA</code></td>
        <td>
          Baixa o <code class="codeStyle">.sra</code> para o cache padrão e emite apenas <code class="codeStyle">val srr</code> para a próxima etapa
          (mantém cache entre execuções).
        </td>
      </tr>
      <tr>
        <td><code class="codeStyle">process SRA_TO_FASTQ</code></td>
        <td>
          Converte <code class="codeStyle">.sra</code> em FASTQs com <code class="codeStyle">fasterq-dump --split-files</code>, compacta
          (<code class="codeStyle">pigz</code> ou <code class="codeStyle">gzip</code>) e emite uma 
          <span class="tooltip"><strong>tupla</strong>
            <span class="tooltiptext">Estrutura com múltiplos valores; aqui, o SRR + os arquivos gerados.</span>
          </span> 
          no formato <code class="codeStyle">(srr, &quot;${srr}_*.fastq.gz&quot;)</code>.
        </td>
      </tr>
      <tr>
        <td><code class="codeStyle">process FASTQC</code></td>
        <td>
          Recebe <code class="codeStyle">tuple val(srr), path(reads)</code> (lista com R1/R2), roda o FastQC e
          publica os relatórios <code class="codeStyle">.html</code>/<code class="codeStyle">.zip</code> em <code class="codeStyle">${params.outdir}/${srr}</code>.
        </td>
      </tr>
      <tr>
        <td><em>Workflow</em></td>
        <td>
          Dois ramos equivalentes que convergem no <code class="codeStyle">FASTQC</code>:
          <br><code class="codeStyle">--fastq</code>: <code class="codeStyle">fromFilePairs(&quot;data/*_{1,2}.fastq.gz&quot;)</code> → <code class="codeStyle">FASTQC</code>
          <br><code class="codeStyle">--srr</code>: <code class="codeStyle">Channel.of(srr)</code> → <code class="codeStyle">DOWNLOAD_SRA</code> → <code class="codeStyle">SRA_TO_FASTQ</code> → <code class="codeStyle">FASTQC</code>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<h3>2.3 Executando o workflow (modo FASTQ local)</h3>

<p style="align-text: justify">Ao executar o comando, o pipeline identifica automaticamente os pares <code class="codeStyle">R1/R2</code> dentro de <code class="codeStyle">data/</code>, roda o processo <code class="codeStyle">FASTQC</code> para cada amostra detectada e, por fim, publica os relatórios <code class="codeStyle">.html</code> e <code class="codeStyle">.zip</code> em <code class="codeStyle">results/&lt;amostra&gt;/</code>.</p>

<p>Após criar o arquivo <code class="codeStyle">nextflow_tut.nf</code> no próximo passo, execute:</p>
<pre>nextflow run nextflow_tut.nf --fastq data/ --outdir results/</pre>

<blockquote class="info">
  Este modo exige arquivos <code class="codeStyle">.fastq.gz</code> no padrão <code class="codeStyle">*_1.fastq.gz</code> e <code class="codeStyle">*_2.fastq.gz</code> dentro de <code class="codeStyle">data/</code>.  
</blockquote>

<h3>2.3 Conferindo a saída</h3>

<p>Você deve ver pastas por amostra dentro de <code class="codeStyle">results/</code>, contendo os relatórios do FastQC. Exemplo:</p>
<pre>results/SRR34840432/SRR34840432_1_fastqc.html
results/SRR34840432/SRR34840432_2_fastqc.html</pre>

<h3>2.4 (Opcional) Rodar com SRA</h3>

<p>O pipeline também suporta baixar direto do SRA. Use <code class="codeStyle">--srr</code> (sem <code class="codeStyle">--fastq</code>):</p>
<pre>nextflow run nextflow_tut.nf --srr SRR34840432 --outdir results/</pre>

<blockquote class="info">
  O pipeline executa, na ordem: <strong>DOWNLOAD_SRA</strong> → <strong>SRA_TO_FASTQ</strong> → <strong>FASTQC</strong>.<br>
  • Baixa o SRR com <code class="codeStyle">prefetch</code> (cache do SRA-Tools);<br>
  • Converte para <code class="codeStyle">_1.fastq.gz</code> e <code class="codeStyle">_2.fastq.gz</code> (<code class="codeStyle">fasterq-dump --split-files</code> + <code class="codeStyle">pigz</code> ou <code class="codeStyle">gzip</code>);<br>
  • Roda o <strong>FastQC</strong> e publica relatórios <code class="codeStyle">.html</code>/<code class="codeStyle">.zip</code> em <code class="codeStyle">results/&lt;SRR&gt;/</code>.
</blockquote>

<p>O seu resultado deve ser parecido com isso:</p>
<img src="/assets/img/nextflow/nextflow_1.png" alt="Execução do Nextflow mostrando os processos do pipeline" />

<blockquote class="tip">
  Dica: se você alternar parâmetros e quiser reaproveitar etapas já feitas, use <code class="codeStyle">-resume</code>:
</blockquote>
<pre>nextflow run nextflow_tut.nf --fastq data/ --outdir results/ -resume</pre>

<p><strong>Quer salvar em outra pasta?</strong></p>
<pre>nextflow run nextflow_tut.nf --srr SRR34840432 --outdir results/meu_fastqc</pre>

<p><strong>Reaproveitar etapas já concluídas:</strong></p>
<pre>nextflow run nextflow_tut.nf --fastq data/ --outdir results/ -resume</pre>

<p><strong>Ver a ajuda dos parâmetros:</strong></p>
<pre>nextflow run nextflow_tut.nf --help</pre>

<h3>2.5 Erros comuns</h3>

<ul>
  <li>
    <strong>Sem pares .fastq.gz:</strong> Se seus arquivos não estão compactados, o canal fica vazio e nada roda.  
    Compacte ou ajuste o padrão.
  </li>
</ul>

---

<h2 id="explicacao-do-codigo">3. Explicação do código</h2>
<h3>3.1 Parâmetros</h3>

<p style="text-align: justify">
  Aqui definimos as variáveis que controlam a execução do pipeline: 
  <code class="codeStyle">params.fastq</code> indica um diretório com FASTQs pareados, 
  <code class="codeStyle">params.srr</code> recebe um ID do SRA para download, 
  <code class="codeStyle">params.outdir</code> define onde salvar os relatórios do FastQC
  e <code class="codeStyle">params.help</code> habilita a mensagem de ajuda. 
  Os modos <code class="codeStyle">--fastq</code> e <code class="codeStyle">--srr</code> serão validados adiante como <em>mutuamente exclusivos</em>, 
  e todos os parâmetros podem ser sobrescritos na linha de comando.
</p>

<pre>
// -------------------- Parâmetros --------------------
params.srr    = null
params.fastq  = null
params.outdir = null
params.help   = false
</pre>

<h3>3.2 Ajuda</h3>

<p style="text-align: justify">
  A função <strong><em>helpMessage()</em></strong> centraliza o guia de uso do pipeline. Ela imprime um banner
  com os dois modos de execução (usar FASTQs locais com <code class="codeStyle">--fastq &lt;dir&gt;</code> ou baixar do SRA com
  <code class="codeStyle">--srr &lt;SRR&gt;</code>), além de listar os parâmetros disponíveis e seus propósitos. Quando o usuário
  executa o script com <code class="codeStyle">--help</code>, o bloco <code class="codeStyle">if (params.help)</code> chama essa função e finaliza
  a execução imediatamente com <code class="codeStyle">System.exit(0)</code>, garantindo que nenhuma etapa do pipeline seja
  iniciada por engano.
</p>

<pre>
// -------------------- Ajuda --------------------
def helpMessage() {
    log.info """
    ======================================================
     Pipeline Nextflow: Download SRA + FastQC
    ======================================================
    Uso:
      nextflow run nextflow_tut.nf --fastq &lt;dir&gt; --outdir &lt;dir&gt;
      nextflow run nextflow_tut.nf --srr &lt;SRR&gt;   --outdir &lt;dir&gt;

    Parâmetros:
      --fastq   Diretório com FASTQs (espera *_1.fastq.gz e *_2.fastq.gz)
      --srr     Acessão SRA (ex.: SRR34840432)
      --outdir  Saída do FastQC
      --help    Mostra esta mensagem
    """
}

if (params.help) { helpMessage(); System.exit(0) }
</pre>

<h3>3.3 Utils</h3>

<p style="text-align: justify">
  A função <code class="codeStyle">requireGzipPairs(dirPath)</code> faz uma verificação no modo
  <code class="codeStyle">--fastq</code> para garantir que existam <strong>pares compactados</strong> no padrão
  <code class="codeStyle">*_1.fastq.gz</code> e <code class="codeStyle">*_2.fastq.gz</code> dentro do diretório informado.
  Primeiro ela valida se o caminho existe e é uma pasta; depois lista apenas os nomes que
  combinam com o sufixo <code class="codeStyle">_(1|2).fastq.gz</code>. Se não houver nenhum arquivo nesse padrão,
  ela aborta. Caso haja arquivos, a função extrai o “prefixo base”
  (tudo antes de <code class="codeStyle">_(1|2).fastq.gz</code>) e verifica se <em>pelo menos um</em> desses
  prefixos possui o par completo (<code class="codeStyle">_1</code> e <code class="codeStyle">_2</code>). Se não houver pares,
  aborta novamente. Se tudo estiver correto, retorna <code class="codeStyle"><em>true</em></code>
  e o workflow pode prosseguir (por exemplo, criando o canal com <code class="codeStyle">fromFilePairs</code>)
  sem ficar “parado” por falta de entradas.
</p>

<pre>
// -------------------- Utils --------------------
// Verifica se existem pares *_1.fastq.gz e *_2.fastq.gz no diretório
def requireGzipPairs(String dirPath) {
  def dir = new File(dirPath)
  if (!dir.exists() || !dir.isDirectory())
    error "Diretório não encontrado: ${dirPath}"

  def names = (dir.listFiles() ?: [])
      .collect { it.name }
      .findAll { it ==~ /.+_(1|2)\.fastq\.gz$/ }

  if (!names || names.isEmpty())
    error "Os arquivos têm que estar compactados (.fastq.gz) no padrão *_1.fastq.gz e *_2.fastq.gz em ${dirPath}."

  def bases = names.collect { it.replaceFirst(/_(1|2)\.fastq\.gz$/, '') }.unique()
  def hasPair = bases.any { base ->
    new File(dir, "${base}_1.fastq.gz").exists() && new File(dir, "${base}_2.fastq.gz").exists()
  }

  if (!hasPair)
    error "Arquivos .fastq.gz encontrados, mas **sem par** correspondente *_1/_2 em ${dirPath}."

  return true
}
</pre>

<h3>3.4 Processo DOWNLOAD_SRA</h3>

<p style="text-align: justify">
  Este processo recebe o identificador <code class="codeStyle">srr</code> e usa <code class="codeStyle">prefetch</code> para baixar o arquivo
  <span class="tooltip"><strong>.sra</strong><span class="tooltiptext">Arquivo bruto do SRA; contém as leituras.</span></span>
  para o cache padrão do SRA-Tools. A saída é o próprio <code class="codeStyle">srr</code> (valor simples), que segue para a próxima etapa.
</p>

<pre>
// 1) Prefetch (cache local do SRA); emite apenas o SRR para o próximo passo
process DOWNLOAD_SRA {
  tag "${srr}"

  input:
  val srr

  output:
  val srr

  script:
  """
  prefetch ${srr}
  """
}
</pre>

<h3>3.4.1 Processo SRA_TO_FASTQ</h3>

<p style="text-align: justify">
  Converte o <code class="codeStyle">.sra</code> baixado em FASTQs com <code class="codeStyle">fasterq-dump</code> (dividindo em R1/R2 com
  <code class="codeStyle">--split-files</code>) e compacta os arquivos resultantes dando preferência ao <code class="codeStyle">pigz</code>
  (paralelo) com <code class="codeStyle">gzip</code> como alternativa. A saída é uma tupla <code class="codeStyle">(srr, arquivos)</code> em que
  <code class="codeStyle">arquivos</code> corresponde ao padrão <code class="codeStyle">"${'{'}srr{'}'}_*.fastq.gz"</code>, preservando a associação da amostra.
</p>

<pre>
// 2) Converter SRA -> FASTQ(.gz) com fasterq-dump
process SRA_TO_FASTQ {
  tag "${srr}"

  input:
  val srr

  output:
  tuple val(srr), path("${srr}_*.fastq.gz")

  script:
  """
  # Gera FASTQs e compacta
  fasterq-dump ${srr} -O . --split-files
  pigz -f ${srr}_1.fastq || gzip -f ${srr}_1.fastq
  pigz -f ${srr}_2.fastq || gzip -f ${srr}_2.fastq || true
  """
}
</pre>

<h3>3.5 Processo FASTQC</h3>

<p style="text-align: justify">
  Recebe <code class="codeStyle">tuple val(srr), path(reads)</code>, onde <code class="codeStyle">reads</code> é a lista com R1/R2 executa o <code class="codeStyle">fastqc</code> e publica os relatórios por amostra em
  <code class="codeStyle">${'{'}params.outdir{'}'}/${'{'}srr{'}'}</code> usando <code class="codeStyle">publishDir</code>. Os artefatos gerados são os arquivos
  <code class="codeStyle">.html</code> e <code class="codeStyle">.zip</code> do FastQC.
</p>

<pre>
// 3) FastQC — recebe (srr, [R1,R2])
process FASTQC {
  tag "${srr}"

  publishDir { "${params.outdir}/${srr}" }, mode: 'copy', overwrite: true

  input:
  tuple val(srr), path(reads)

  output:
  path "*.html"
  path "*.zip"

  script:
  """
  fastqc -o . ${reads}
  """
}
</pre>


<h3>3.6 Workflow</h3>

<p style="text-align: justify">
  O <em>workflow</em> escolhe entre dois ramos de execução, conforme o parâmetro informado.
  No modo <code class="codeStyle">--fastq</code>, ele registra o modo nos logs, faz uma verificação
  com <code class="codeStyle">requireGzipPairs(...)</code> para garantir a presença de pares <code class="codeStyle">*_1.fastq.gz</code> e
  <code class="codeStyle">*_2.fastq.gz</code>, cria um canal de pares com <code class="codeStyle">fromFilePairs</code> (emitindo
  <code class="codeStyle">(id, [R1,R2])</code>) e envia diretamente para o processo <code class="codeStyle">FASTQC</code>. 
  No modo <code class="codeStyle">--srr</code>, ele registra o SRR, cria um canal com o identificador, baixa o acesso
  com <code class="codeStyle">DOWNLOAD_SRA</code>, converte para FASTQ com <code class="codeStyle">SRA_TO_FASTQ</code> (emitindo
  <code class="codeStyle">(srr, &quot;${'{'}srr{'}'}_*.fastq.gz&quot;)</code>) e então executa o <code class="codeStyle">FASTQC</code>. 
  Se nenhum modo for fornecido (ou se houver conflito), o pipeline é abortado.
  O comentário no código mostra, como referência, como normalizar a saída caso você tenha um
  <code class="codeStyle">SRA_TO_FASTQ</code> que emita três campos (<code class="codeStyle">srr, r1, r2</code>) em vez de uma lista.
</p>

<pre>
// -------------------- Workflow --------------------
workflow {
  if (params.fastq) {
    log.info "Modo: FASTQ local"
    log.info "FASTQ dir: ${params.fastq}"

    // ---- Verificação de gzip ----
    requireGzipPairs(params.fastq as String)

    // Só depois cria a channel:
    fastq_ch = Channel.fromFilePairs("${params.fastq}/*_{1,2}.fastq.gz")

    FASTQC(fastq_ch)
  }
  else if (params.srr) {
    log.info "Modo: SRA"
    log.info "Iniciando pipeline com SRR: ${params.srr}"

    srr_ch   = Channel.of(params.srr)
    cached   = DOWNLOAD_SRA(srr_ch)
    fastq_ch = SRA_TO_FASTQ(cached)

    FASTQC(fastq_ch)
  }
  else {
    error "Forneça --fastq &lt;dir&gt; (FASTQ local) ou --srr &lt;ID&gt; (SRA). Use --help para ajuda."
  }
}
</pre>

---

# Conclusão

<p style="text-align: justify">
Você instalou o <a class="badge badge--nextflow" href="https://www.nextflow.io/" target="_blank" rel="noopener">Nextflow</a>
e rodou seu primeiro workflow com FastQC usando ambiente <span class="badge badge--conda">Conda</span>.
Daqui para frente, é só ir plugando novas etapas (ex.: TrimGalore!, BWA, Samtools, MultiQC) e deixar o <span class="badge badge--nextflow">Nextflow</span> orquestrar tudo com classe.
</p>

Até a próxima!

<img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3hjbGViODEyaWVmdHlvc2ZqZW5ueDF6dWNqdTU0aGVqMXVhaXFmZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/DfbpTbQ9TvSX6/giphy.gif" alt="gif" width="200" style="display:block; margin:auto;">

---

Se curtiu, dá aquele apoio no <a href="https://www.linkedin.com/in/christopher-lee-390643197/" target="_blank">LinkedIn</a> e considere um cafézinho ☕ para manter o projeto vivo. Valeu!

Pix: [biologolee@gmail.com](mailto:biologolee@gmail.com)<br>
Bitcoin: bc1qg7qrfhclzt3sm60en53qv8fmwpuacfaxt5v55k

![QR Code](/assets/img/meus_projetos/bluewallet_qrcode.png)

# Referências

1. <a href="https://www.nextflow.io/docs/latest/index.html" target="_blank">Documentação oficial do Nextflow</a>
2. <a href="https://docs.conda.io/projects/conda/en/latest/index.html/" target="_blank">Conda</a>