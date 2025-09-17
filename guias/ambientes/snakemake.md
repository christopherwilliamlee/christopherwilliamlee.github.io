---
layout: guia
title: Tutorial prático de Snakemake (WSL)
permalink: /guias/ambientes/snakemake/
---

![Snakemake logo](/assets/img/snakemake/snakemake_logo.png)

# <u>Workflow com Snakemake (WSL) — baixando SRA e gerando FASTQ</u>

<p style="align-text: justify">
  Fala, pessoal! Se você já cansou de rodar comandos soltos no terminal e quer 
  <strong>organizar sua análise em etapas reprodutíveis</strong>, 
  o <span class="badge badge--snakemake">Snakemake</span> é exatamente o que você precisa. 
  Ele transforma sua pipeline em um 
  <span class="tooltip">arquivo declarativo
    <span class="tooltiptext">Descreve o que fazer, não como fazer.</span>
  </span> 
  (o <span class="badge badge--snakemake">Snakemake</span>) e cuida de dependências, paralelismo e repetição automática só do que falta. 
  Ele é maravilhosoo!! 🥹🥹🥹
</p>


Neste guia, vamos montar um **workflow básico** para:

- **Baixar dados do SRA** (via `sra-tools`);
- **Converter para FASTQ** (`fasterq-dump`);
- **Compactar e contar reads** (para QC simples);
- Fazer tudo isso **no WSL**.
- No final tenho um desafio!!

A ideia é: você define as regras e deixa o <span class="badge badge--snakemake">Snakemake</span> fazer o trabalho pesado.

<img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbjB5cjE1NjByNmY1cG0yOTJod2Z6NjhmdTM5NDVzeTIzYXRxMWNjMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26BRPVW5a4hx275Vm/giphy.gif" alt="gif" width="300" style="display:block; margin:auto;">

---

# O que é o Snakemake?

<ul>
  <li>
    O <span class="badge badge--snakemake">Snakemake</span> é inspirado no 
    <a href="https://en.wikipedia.org/wiki/Make_(software)" target="_blank">
      <span class="tooltip">make
        <span class="tooltiptext">GNU Make é um programa para automatizar processos.</span>
      </span>
    </a>, mas foi pensado para ciência de dados e bioinformática.
  </li>

  <li>
    Você descreve 
    <span class="tooltip"><strong>alvos finais</strong>
      <span class="tooltiptext">Arquivos ou resultados finais que você quer gerar, como um FASTQ processado ou uma tabela.</span>
    </span> 
    e 
    <span class="tooltip"><strong>regras</strong>
      <span class="tooltiptext">Instruções que explicam como transformar arquivos de entrada em saída.</span>
    </span> 
    usando 
    <span class="tooltip"><em>inputs</em>
      <span class="tooltiptext">Arquivos de entrada necessários para executar a regra.</span>
    </span> 
    e 
    <span class="tooltip"><em>outputs</em>
      <span class="tooltiptext">Arquivos de saída produzidos pela regra.</span>
    </span>.
  </li>

  <li>
    O <span class="badge badge--snakemake">Snakemake</span> resolve a ordem certa, executa em paralelo e evita retrabalho.
  </li>

  <li>
    É perfeito para garantir 
    <span class="tooltip"><strong>reprodutibilidade</strong>
      <span class="tooltiptext">Capacidade de repetir a análise e obter os mesmos resultados em qualquer computador.</span>
    </span> 
    e 
    <span class="tooltip"><strong>organização</strong>
      <span class="tooltiptext">Estrutura clara dos arquivos e etapas, sem precisar relembrar comandos manuais.</span>
    </span>.
  </li>
</ul>


O que você vai precisar <u>antes</u>:

- **WSL** (Linux no Windows) — [tutorial](/guias/plataforma/wsl)  
- **sra-tools** (prefetch / fasterq-dump) — [sra-tools](/guias/ferramentas/sra-tools)  
- **Conda (opcional, mas recomendado)** para instalar o <span class="badge badge--snakemake">Snakemake</span> — [Conda](/guias/ambientes/anaconda/)  

<blockquote class="info">
  Você pode instalar o <span class="badge badge--snakemake">Snakemake</span> via <strong>conda</strong> (recomendado) ou <strong>pip</strong>. Aqui vamos de conda.
</blockquote>

---

## Passo a passo
1. [Instalação do Snakemake](#instalacao-do-snakemake)  
2. [Estrutura do projeto](#estrutura-do-projeto)  
3. [Configuração (config.yaml)](#configuracao-configyaml)  
4. [Snakefile (regras)](#snakefile-regras)  
5. [Executar e atualizar o workflow](#executar-inspecionar-e-atualizar-o-workflow)  
6. [Explicação do código](#explicacao-do-codigo)

---

<h2 id="instalacao-do-snakemake">1. Instalação do Snakemake</h2>
Com o **Conda** instalado no WSL, crie um ambiente dedicado:

<pre>conda create -n smk -c conda-forge -c bioconda snakemake=8.* sra-tools pigz -y</pre>
<pre>conda activate smk</pre>

<blockquote class="tip">
Incluímos sra-tools e pigz (compactação paralela). Se preferir, dá pra instalar <span class="badge badge--snakemake">Snakemake</span> via <code class="codeStyle">pip install snakemake</code>, mas o ecossistema bio costuma ficar mais estável via conda.
</blockquote>

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
        <td>conda create</td>
        <td>Cria um novo ambiente Conda.</td>
      </tr>
      <tr>
        <td>-n smk</td>
        <td>Define o nome do ambiente como "smk".</td>
      </tr>
      <tr>
        <td>-c conda-forge</td>
        <td>Usa o canal conda-forge (repositório comunitário).</td>
      </tr>
      <tr>
        <td>-c bioconda</td>
        <td>Usa o canal bioconda (bioinformática).</td>
      </tr>
      <tr>
        <td>snakemake=8.*</td>
        <td>Instala o Snakemake versão 8.</td>
      </tr>
      <tr>
        <td>sra-tools</td>
        <td>Ferramentas do SRA (download/convert).</td>
      </tr>
      <tr>
        <td>pigz</td>
        <td>gzip paralelo (compactação rápida).</td>
      </tr>
      <tr>
        <td>-y</td>
        <td>Aceita confirmações automaticamente.</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 id="estrutura-do-projeto">2. Estrutura do projeto</h2>
Crie uma pastinha para o workflow:

<pre>mkdir -p ~/smk_demo/smk-sra-demo/{config,fastq,logs,sra,tmp}</pre>
<pre>cd smk_demo/smk-sra-demo</pre>

<blockquote class="info">
  <code>mkdir -p ~/smk_demo/smk-sra-demo/{config,fastq,logs,sra,tmp}</code>
  <br><br>
  Esse comando cria a estrutura de pastas necessária para o projeto <span class="badge badge--snakemake">Snakemake</span>:
  <ul>
    <li><strong>config</strong> → onde ficam os arquivos de configuração (ex: YAML com parâmetros).</li>
    <li><strong>fastq</strong> → diretório para armazenar os arquivos FASTQ brutos.</li>
    <li><strong>logs</strong> → registros de execução (logs de cada regra).</li>
    <li><strong>sra</strong> → downloads originais do SRA (formato .sra).</li>
    <li><strong>tmp</strong> → arquivos temporários usados durante o workflow.</li>
  </ul>
  A opção <code>-p</code> garante que as pastas sejam criadas de forma recursiva, sem erro caso já existam.
</blockquote>


<h2 id="configuracao-configyaml">3. Configuração (<code>config.yaml</code>)</h2>
Vamos listar os acessos SRA que queremos baixar. Crie o arquivo:

<pre>nano config/config.yaml</pre>

Cole o conteúdo abaixo e salve:

<pre># config/config.yaml
samples:
  - SRR34840432      # <-- troque por seus SRRs

# Opções para fasterq-dump
fasterq:
  threads: 4
  tmpdir: "tmp"

# Gzip paralelo (pigz)
pigz_threads: 4 </pre>

<blockquote class="tip">
  <strong>Dicas rápidas do <code>nano</code></strong><br><br>
  O <code>nano</code> é um editor de texto simples no terminal. Alguns atalhos úteis:
  <ul>
    <li><code>Ctrl + O</code> → Salvar (escrever alterações no arquivo).</li>
    <li><code>Ctrl + X</code> → Sair do <code>nano</code> (pede para salvar antes, se houve mudanças).</li>
    <li><code>Ctrl + W</code> → Buscar texto dentro do arquivo.</li>
    <li><code>Ctrl + K</code> → Cortar a linha atual.</li>
    <li><code>Ctrl + U</code> → Colar a linha cortada.</li>
    <li><code>Ctrl + G</code> → Ajuda (mostra todos os comandos).</li>
  </ul>
  Dica: a barra inferior do <code>nano</code> mostra os principais atalhos — o símbolo <code>^</code> significa “Ctrl”.
</blockquote>


<h2 id="snakefile-regras">4. Snakefile (regras)</h2>
Crie o Snakefile na raiz do projeto:

<pre>nano Snakefile</pre>

Cole o conteúdo:

<pre># Snakefile

configfile: "config/config.yaml"

SAMPLES = config["samples"]
FASTERQ_THREADS = int(config.get("fasterq", {}).get("threads", 4))
TMPDIR = config.get("fasterq", {}).get("tmpdir", "tmp")
PIGZ_THREADS = int(config.get("pigz_threads", 4))

# (Opcional) Validar wildcards: SRR + dígitos
wildcard_constraints:
    s = r"SRR[0-9]+"

# Alvo final: FASTQ compactados + contagem simples de reads
rule all:
    input:
        expand("fastq/{s}_1.fastq.gz", s=SAMPLES),
        expand("fastq/{s}_2.fastq.gz", s=SAMPLES),
        expand("logs/{s}.reads.txt", s=SAMPLES)

# 1) Baixar o .sra (cache local em ./sra/{s}/{s}.sra)
rule prefetch:
    output:
        "sra/{s}/{s}.sra"    # se quiser economizar espaço: temp("sra/{s}/{s}.sra")
    log:
        "logs/{s}.prefetch.log"
    shell:
        "prefetch {wildcards.s} -O sra &> {log}"

# 2) Converter .sra em FASTQ pareado (sem compressão)
rule fasterq_dump:
    input:
        "sra/{s}/{s}.sra"
    output:
        temp("fastq/{s}_1.fastq"),
        temp("fastq/{s}_2.fastq")
    threads: FASTERQ_THREADS
    params:
        tmp = TMPDIR
    log:
        "logs/{s}.fasterq.log"
    benchmark:
        "logs/{s}.fasterq.benchmark.tsv"
    shell:
        r"""
        mkdir -p {params.tmp} fastq
        fasterq-dump --split-files --threads {threads} --temp {params.tmp} -O fastq {input} &> {log}
        """

# 3) Compactar com pigz
rule gzip_fastq:
    input:
        r1 = "fastq/{s}_1.fastq",
        r2 = "fastq/{s}_2.fastq"
    output:
        r1_gz = "fastq/{s}_1.fastq.gz",
        r2_gz = "fastq/{s}_2.fastq.gz"
    threads: PIGZ_THREADS
    log:
        "logs/{s}.pigz.log"
    benchmark:
        "logs/{s}.pigz.benchmark.tsv"
    shell:
        r"""
        ( pigz -p {threads} -f {input.r1}
          pigz -p {threads} -f {input.r2} ) &> {log}
        """

# 4) QC simples: contar reads (linhas/4)
rule count_reads:
    input:
        r1 = "fastq/{s}_1.fastq.gz",
        r2 = "fastq/{s}_2.fastq.gz"
    output:
        "logs/{s}.reads.txt"
    log:
        "logs/{s}.count_reads.log"
    shell:
        r"""
        set -euo pipefail
        mkdir -p logs
        r1=$(( $(pigz -dc {input.r1} | wc -l) / 4 ))
        r2=$(( $(pigz -dc {input.r2} | wc -l) / 4 ))
        (
          printf "Sample\tR1_reads\tR2_reads\n" > {output}
          printf "%s\t%s\t%s\n" "{wildcards.s}" "$r1" "$r2" >> {output}
        ) &> {log}
        """
</pre>

<h2 id="executar-inspecionar-e-atualizar-o-workflow">5. Executar e atualizar o workflow</h2>
Ative o ambiente (se ainda não estiver ativo) e rode:

<pre>conda activate smk
snakemake -j 4</pre>

<blockquote class="tip">
  <code>-j 4</code> → Define que o <span class="badge badge--snakemake">Snakemake</span> pode executar até <strong>4 tarefas em paralelo</strong>.  
  Ajuste esse número de acordo com a quantidade de <strong>núcleos da sua CPU</strong> para aproveitar melhor o desempenho da máquina.
</blockquote>


Você deverá ter algo assim:

![Snakemake 1](/assets/img/snakemake/snakemake_1.png)

Você poderá ver os seus resultados aqui:

![Snakemake 2](/assets/img/snakemake/snakemake_2.png)

Re-executar somente o que está faltando (Snakemake já faz isso!):

<pre>snakemake -j 4</pre>

Limpar outputs gerados (cuidado!):

<pre>snakemake --delete-all-output</pre>

## Onde ficam os arquivos?
SRA: sra/SRRxxxxx/SRRxxxxx.sra
FASTQ gz: fastq/SRRxxxxx_1.fastq.gz e fastq/SRRxxxxx_2.fastq.gz
Leituras contadas: logs/SRRxxxxx.reads.txt

### Abra o .reads.txt para ver um resumo rápido:
<pre>column -t logs/*.reads.txt | less -S</pre>

<blockquote class="tip">
Dicas (WSL + SRA-Tools)
Se faltar espaço em /tmp, use o tmpdir do config.yaml (já configurado para tmp/)
</blockquote>

<blockquote class="tip">
Se o prefetch estiver lento, configure o cache do SRA na sua home (vdb-config --interactive)
</blockquote>

<blockquote class="tip">
Para testar rápido, use um SRR e depois aumente a lista
</blockquote>

<blockquote class="tip">
Personalizando
Edite config/config.yaml e adicione/remova SRRs.
</blockquote>

### Quer rodar apenas um sample?

<pre>snakemake -j 4 fastq/SRR34840432_1.fastq.gz fastq/SRR34840432_2.fastq.gz</pre>

- Ver o que **seria** executado (sem rodar): `snakemake -n -p`
- Ver o DAG: `snakemake --dag | dot -Tsvg > dag.svg`
- Resumo/estado: `snakemake --summary`
- Relatório reproduzível: `snakemake --report report.zip`
- Reexecutar alvos incompletos: `snakemake --rerun-incomplete`
- FS lento? `snakemake -j 4 --latency-wait 60`
- Lembrete: `-j` = jobs concorrentes; `threads:` = CPUs **por** job.


<h2 id="explicacao-do-codigo">6. Explicação do código</h2>
## 1. configfile: "config/config.yaml"

<ul>
  <li>
    Diz ao <span class="badge badge--snakemake">Snakemake</span> para ler um 
    <span class="tooltip"><strong>arquivo YAML</strong>
      <span class="tooltiptext">Formato de configuração simples e legível, usado para organizar parâmetros.</span>
    </span> 
    de configuração.
  </li>

  <li>
    Isso mantém os 
    <span class="tooltip"><strong>parâmetros</strong>
      <span class="tooltiptext">Valores como lista de amostras (SRRs), número de threads ou diretórios temporários.</span>
    </span> 
    fora do código, deixando o workflow mais limpo e fácil de ajustar.
  </li>
</ul>

### Exemplo de config/config.yaml:

<pre>
samples:
  - SRR34840432   # pode ter 1 ou várias entradas

fasterq:
  threads: 4 # Núcleos a serem utilizados
  tmpdir: "tmp"

pigz_threads: 4
</pre>

## 2. Variáveis Python lidas do YAML

<pre>
SAMPLES = config["samples"]
FASTERQ_THREADS = int(config.get("fasterq", {}).get("threads", 4))
TMPDIR = config.get("fasterq", {}).get("tmpdir", "tmp")
PIGZ_THREADS = int(config.get("pigz_threads", 4))
</pre>

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
        <td><strong>YAML</strong></td>
        <td>Formato de arquivo usado para guardar informações de configuração de forma organizada e fácil de ler.</td>
      </tr>
      <tr>
        <td><strong>SAMPLES</strong></td>
        <td>Lista de acessos 
          <span class="tooltip"><strong>SRA</strong>
            <span class="tooltiptext">Repositório Sequence Read Archive, onde ficam armazenados dados públicos de sequenciamento.</span>
          </span> 
          (ex.: <code>["SRR34840432"]</code>).
        </td>
      </tr>
      <tr>
        <td><strong>FASTERQ_THREADS</strong></td>
        <td>Número de threads para o <code>fasterq-dump</code>.</td>
      </tr>
      <tr>
        <td><strong>TMPDIR</strong></td>
        <td>Pasta para arquivos temporários do SRA-tools (evita encher <code>/tmp</code>).</td>
      </tr>
      <tr>
        <td><strong>PIGZ_THREADS</strong></td>
        <td>Número de threads do <code>pigz</code> (gzip paralelo).</td>
      </tr>
      <tr>
        <td><em>Observação</em></td>
        <td>Essas variáveis podem ser usadas dentro das regras (como em <code>threads:</code> ou <code>params:</code>).</td>
      </tr>
    </tbody>
  </table>
</div>

## 3. rule all — o alvo agregado

<pre>
rule all:
    input:
        expand("fastq/{s}_1.fastq.gz", s=SAMPLES),
        expand("fastq/{s}_2.fastq.gz", s=SAMPLES),
        expand("logs/{s}.reads.txt", s=SAMPLES)
</pre>

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
        <td><strong>rule all</strong></td>
        <td>
          Define os 
          <span class="tooltip"><strong>alvos finais</strong>
            <span class="tooltiptext">Arquivos ou resultados finais que você quer gerar.</span>
          </span> 
          que o workflow precisa gerar.
        </td>
      </tr>
      <tr>
        <td><strong>expand</strong></td>
        <td>
          Cria automaticamente a lista desses resultados para todas as amostras, substituindo 
          <code>{s}</code> pelos nomes em <code>SAMPLES</code> 
          (ex.: 1 amostra gera 3 arquivos, 100 amostras geram 300).
        </td>
      </tr>
    </tbody>
  </table>
</div>


<blockquote class="info">
  <p>O <span class="badge badge--snakemake">Snakemake</span> então monta a sequência lógica de etapas (
  <span class="tooltip">DAG
    <span class="tooltiptext">Mapa que mostra a ordem e dependências das etapas.</span>
  </span>
  ) para chegar nesses resultados e executa apenas o que ainda não foi feito ou está desatualizado.</p>
</blockquote>

## 4. rule prefetch — baixar o .sra

<pre>
rule prefetch:
    output:
        "sra/{s}/{s}.sra"
    shell:
        """
        prefetch {wildcards.s} -O sra
        """
</pre>

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
        <td><strong>output</strong></td>
        <td>Indica onde o arquivo final deve existir ao término da regra.</td>
      </tr>
      <tr>
        <td><code>{s}</code></td>
        <td>
          É um 
          <span class="tooltip"><strong>wildcard</strong>
            <span class="tooltiptext">Um curinga que assume valores diferentes, como os nomes das amostras (ex.: SRR34840432).</span>
          </span>, 
          substituído automaticamente por cada SRR da lista.
        </td>
      </tr>
      <tr>
        <td><code>prefetch</code></td>
        <td>Baixa o acesso e cria uma subpasta (<code>sra/SRR.../SRR....sra</code>).</td>
      </tr>
      <tr>
        <td><em>Dependência</em></td>
        <td>O <span class="badge badge--snakemake">Snakemake</span> entende que, se <code>fastq/...</code> depende de <code>sra/{s}/{s}.sra</code>, esta regra precisa rodar primeiro.</td>
      </tr>
    </tbody>
  </table>
</div>


<blockquote class="info">
Se sua versão do SRA-tools não criasse subpastas, bastaria apontar para sra/{s}.sra. Aqui usamos o comportamento mais comum/estável.
</blockquote>

## 5. rule fasterq_dump — converter .sra em FASTQ

<pre>
rule fasterq_dump:
    input:
        "sra/{s}/{s}.sra"
    output:
        temp("fastq/{s}_1.fastq"),
        temp("fastq/{s}_2.fastq")
    threads: FASTERQ_THREADS
    params:
        tmp=TMPDIR
    log:
        "logs/{s}.fasterq.log"
    benchmark:
        "logs/{s}.fasterq.benchmark.tsv"
    shell:
        r"""
        mkdir -p {params.tmp} fastq
        fasterq-dump --split-files --threads {threads} --temp {params.tmp} -O fastq {input} &> {log}
        """
</pre>

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
        <td><strong>input</strong></td>
        <td>Exige o arquivo <code>.sra</code> já baixado. Assim o <span class="badge badge--snakemake">Snakemake</span> garante a ordem de execução.</td>
      </tr>
      <tr>
        <td><strong>output</strong></td>
        <td>Produz <code>R1</code> e <code>R2</code> não compactados.</td>
      </tr>
      <tr>
        <td><code>temp(...)</code></td>
        <td>
          Marca os arquivos como 
          <span class="tooltip"><strong>intermediários</strong>
            <span class="tooltiptext">Gerados no meio do processo; são removidos automaticamente quando o pipeline termina com sucesso.</span>
          </span>; mantém o projeto limpo e economiza espaço.
        </td>
      </tr>
      <tr>
        <td><strong>threads</strong></td>
        <td>
          Informa ao <span class="badge badge--snakemake">Snakemake</span> quantas 
          <span class="tooltip"><strong>CPUs</strong>
            <span class="tooltiptext">Número de núcleos alocados para a regra; útil para paralelizar e escalar.</span>
          </span> a regra pode usar.
        </td>
      </tr>
      <tr>
        <td><strong>params.tmp</strong></td>
        <td>
          Pasta temporária do 
          <span class="tooltip"><strong>SRA-tools</strong>
            <span class="tooltiptext">Conjunto de utilitários do NCBI (ex.: prefetch, fasterq-dump) para baixar e converter dados do SRA.</span>
          </span> (evita gargalos em <code>/tmp</code>).
        </td>
      </tr>
      <tr>
        <td><code>--split-files</code></td>
        <td>
          Separa leituras 
          <span class="tooltip"><strong>paired-end</strong>
            <span class="tooltiptext">Biblioteca com duas leituras por fragmento (R1 e R2), uma de cada extremidade.</span>
          </span> em <code>R1/R2</code>.
        </td>
      </tr>
      <tr>
        <td><code>{input}</code></td>
        <td>Passa o caminho do <code>.sra</code> explicitamente para o comando (também funciona passando apenas o acesso).</td>
      </tr>
    </tbody>
  </table>
</div>


<blockquote class="info">
Se for single-end, troque a regra para gerar um FASTQ e ajuste as regras seguintes.
</blockquote>

## 6. rule gzip_fastq — compactar com pigz

<pre>
rule gzip_fastq:
    input:
        r1="fastq/{s}_1.fastq",
        r2="fastq/{s}_2.fastq"
    output:
        r1_gz="fastq/{s}_1.fastq.gz",
        r2_gz="fastq/{s}_2.fastq.gz"
    threads: PIGZ_THREADS
    shell:
        r"""
        pigz -p {threads} -f {input.r1}
        pigz -p {threads} -f {input.r2}
        """
</pre>

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
        <td><strong>pigz</strong></td>
        <td>
          É um <code>gzip</code> paralelo. Comprime arquivos usando várias 
          <span class="tooltip"><strong>CPUs</strong>
            <span class="tooltiptext">Quantidade de núcleos: executa várias tarefas.</span>
          </span>, ficando bem mais rápido que o <code>gzip</code> tradicional.
        </td>
      </tr>
      <tr>
        <td><strong>threads</strong></td>
        <td>Comunica ao escalonador do <span class="badge badge--snakemake">Snakemake</span> quantas CPUs reservar para essa regra.</td>
      </tr>
      <tr>
        <td><code>-f</code></td>
        <td>Força a sobrescrita de arquivos existentes (útil ao relançar trechos do workflow).</td>
      </tr>
    </tbody>
  </table>
</div>


## 7. rule count_reads — QC simples

<pre>
rule count_reads:
    input:
        r1="fastq/{s}_1.fastq.gz",
        r2="fastq/{s}_2.fastq.gz"
    output:
        "logs/{s}.reads.txt"
    shell:
        r"""
        mkdir -p logs
        r1=$(( $(pigz -dc {input.r1} | wc -l) / 4 ))
        r2=$(( $(pigz -dc {input.r2} | wc -l) / 4 ))
        echo -e "Sample\tR1_reads\tR2_reads" > {output}
        echo -e "{wildcards.s}\t$r1\t$r2" >> {output}
        """
</pre>

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
        <td><code>zcat | wc -l</code></td>
        <td>
          Conta o número de linhas de um arquivo FASTQ compactado; como cada 
          <span class="tooltip"><strong>read</strong>
            <span class="tooltiptext">Read individual produzida pelo sequenciador; em FASTQ cada read ocupa 4 linhas.</span>
          </span> 
          ocupa 4 linhas, o total de reads é <code>linhas ÷ 4</code>.
        </td>
      </tr>
      <tr>
        <td><em>Relatório TSV</em></td>
        <td>Gera um relatório tabular simples por amostra no formato <code>TSV</code> (valores separados por tabulação).</td>
      </tr>
      <tr>
        <td><code>mkdir -p logs</code></td>
        <td>Garante que a pasta <code>logs</code> exista (cria se não existir).</td>
      </tr>
    </tbody>
  </table>
</div>



## Como o Snakemake decide a ordem (DAG)

<ul>
  <li>
    Ao rodar <code>snakemake -j 4</code>, o <span class="badge badge--snakemake">Snakemake</span> olha os 
    <span class="tooltip"><strong>alvos finais</strong>
      <span class="tooltiptext">Arquivos ou resultados finais que você quer gerar, como um FASTQ processado ou uma tabela.</span>
    </span> definidos em <code>rule all</code>.
  </li>

  <li>
    Para cada arquivo que ainda não existe, ele rastreia para trás qual regra produz aquela saída.
  </li>

  <li>
    Monta um 
    <span class="tooltip"><strong>DAG</strong>
      <span class="tooltiptext">Mapa que mostra a ordem e dependências das etapas.</span>
    </span> (grafo acíclico dirigido) e executa as regras na ordem correta, em paralelo até o limite de jobs definido por <code>-j</code>.
  </li>

  <li>
    Se você relançar o workflow, ele pula o que já está pronto — evitando retrabalho.
  </li>

  <li>
    Quer trocar o número de threads? Ajuste <code>FASTERQ_THREADS</code> e <code>PIGZ_THREADS</code> no <code>config.yaml</code>.
  </li>
</ul>


---
Vamos de novos desafios?
Eu não vou ensinar aqui quero que você aprenda sozinho a como
adicionar FastQC/MultiQC como novas regras.

Cada ferramenta extra que você incluir pode ter o respectivo tutorial nos seus guias. Ex.: <a href="/guias/ferramentas/sra-tools" target="_blank">sra-tools</a>, <a href="/guias/ambientes/anaconda/" target="_blank">Conda</a>, <a href="/guias/plataforma/wsl" target="_blank">WSL</a>.

Qualquer dúvida que você tiver, pode me chamar no linkedin ou qualquer outra rede social ou até por e-mail ou sinal de fumaça! 
Que os jogos comecem!

Até a próxima!<br>

<img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjllNzQ0MmRwajRpZG9veXY5YTExeGE2NTd3Y25qZDJ2c2k5ZmozaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/146VPTjfO0tKG4/giphy.gif" alt="gif" width="300" style="display:block; margin:auto;">

---

Dê um suporte ao meu projeto. Doe um cafézinho ☕.<br>
Pix: biologolee@gmail.com<br>
Bitcoin: bc1qg7qrfhclzt3sm60en53qv8fmwpuacfaxt5v55k

![QR Code](/assets/img/meus_projetos/bluewallet_qrcode.png)

---

Referências:

<a href="https://snakemake.readthedocs.io" target="_blank">Documentação oficial do Snakemake</a>

<a href="https://github.com/ncbi/sra-tools" target="_blank">NCBI SRA-Tools</a>