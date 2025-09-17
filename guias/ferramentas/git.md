---
layout: guia
title: Tutorial rápido de Git
permalink: /guias/ferramentas/git/
---

![Git logo](/assets/img/git/git.png)

# <u>Tutorial rápido de Git</u>

<p style="text-align: justify">
  Fala, pessoal! Hoje vou mostrar como instalar e dar os primeiros passos com o <strong>Git</strong>.<br>
  Se você nunca mexeu com controle de versão, o Git é a melhor forma de organizar seus projetos e colaborar com outras pessoas.
</p>
<p style="text-align: justify">
  Eu já passei pelo perrengue de salvar várias versões do mesmo arquivo com nome tipo
  <em>“projeto_final_v2_definitivo_agora_sim.docx”</em>. Pois é… 😂 Com o Git isso acaba:
  você tem histórico, pode reverter mudanças e trabalhar em equipe sem bagunça.
</p>
<p style="text-align: justify">
  Neste tutorial, você vai instalar, configurar e fazer os primeiros commits no <strong>WSL/Ubuntu</strong>.
  É tranquilo e vai te poupar muita dor de cabeça, seja em projetos de código ou de escrita.
</p>

<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXgxZmZibmo1ZWRqOW83YzViYWpmdzV2a2VvNjN3MmM1enJxOWZiNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/hCp63osBu9CuI/giphy.gif" alt="Gif divertido sobre Git" width="220" style="display:block; margin:1rem auto;">

<p>
  Essa ferramenta vai mudar a sua vida. Ah, se vai! 🚀
</p>

# <u>O que é o Git?</u>

<p>
  O <strong>Git</strong> é um sistema de <span class="tooltip"><strong>controle de versão distribuído</strong>
    <span class="tooltiptext">Armazena o histórico dos arquivos localmente e permite colaboração eficiente.</span>
  </span>.
  Ele salva o histórico dos seus arquivos, permite voltar atrás em qualquer alteração, clonar repositórios do
  <strong>GitHub</strong> e facilita o trabalho em equipe.
</p>

<p>
  Na prática, ele é a <strong>máquina do tempo</strong> dos seus projetos.
</p>

O que você vai precisar <u>antes</u>:

- Se estiver no Windows, use o <strong>WSL</strong>.  
- Se ainda não configurou, veja o <a href="/guias/plataforma/wsl/" target="_blank">tutorial do WSL</a>.  
- Crie sua conta no <a href="https://github.com" target="_blank">GitHub</a> (é lá que seus repositórios podem ficar na nuvem).

<blockquote class="tip"><strong>Dica:</strong> para facilitar o login mais tarde, ative o <strong>2FA</strong> na sua conta do GitHub.</blockquote>

---

## Passo a passo
1. [Instalando](#instalando)  
2. [Configurando](#configurando)  
3. [Criando um repositório](#criando-repositorio)  
4. [Primeiro commit](#primeiro-commit)  
5. [Conectando ao GitHub](#github)  
6. [Clonando e sincronizando](#clonar-sync)  
7. [Erros comuns e como corrigir](#erros)

---

<h2 id="instalando">1. Instalando</h2>

![G_1](/assets/img/git/g_1.png)  
No terminal do **WSL/Ubuntu**:

<pre>sudo apt update && sudo apt install -y git</pre>

![G_2](/assets/img/git/g_2.png)  
Verifique se deu certo — vai aparecer a versão instalada:

<pre>git --version</pre>

---

<h2 id="configurando">2. Configurando</h2>

![G_3](/assets/img/git/g_3.png)

Antes de usar, diga ao Git quem é você (isso aparece no histórico dos commits):

<pre>git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"</pre>


<blockquote class="tip">
<strong>Dica (opcional):</strong> 
deixar o Git colorido ajuda a ler os logs:
<pre>git config --global color.ui auto</pre>

Padronize a branch inicial como <code>main</code>:
<pre>git config --global init.defaultBranch main</pre>
</blockquote>

---

<h2 id="criando-repositorio">3. Criando um repositório</h2>

![G_4](/assets/img/git/g_4.png)

Crie uma pasta e inicialize o Git:

<pre>mkdir meu_projeto
cd meu_projeto
git init</pre>

Agora confira o status:

<pre>git status</pre>

Se aparecer algo como <strong>“On branch master”</strong> e um aviso sobre <em>main</em>, está tudo ok — é só um hint.

<blockquote class="tip">
Quer começar já com <strong>main</strong> aqui?
<pre>git branch -m main</pre>
</blockquote>

---

<h2 id="primeiro-commit">4. Primeiro commit</h2>

![G_5](/assets/img/git/g_5.png)  
Crie um arquivo e adicione ao Git:

<pre>echo "# Meu projeto" > README.md
git add README.md
git commit -m "feat: primeiro commit"</pre>

![G_6](/assets/img/git/g_6.png)  
Para adicionar <strong>tudo</strong> que mudou de uma vez:

<pre>git add .
git commit -m "att todos os arquivos"</pre>

---

<h2 id="github">5. Conectando ao GitHub</h2>

![G_7](/assets/img/git/g_7.png)

1. Crie um repositório <strong>vazio</strong> no GitHub.  
2. Conecte o remoto e envie:

<pre>git remote add origin https://github.com/christopherwilliamlee/meu_projeto.git
git branch -M main
git push -u origin main</pre>

<blockquote class="info">
<strong>Autenticação:</strong> usando HTTPS, o Git pode pedir um <strong>token pessoal (PAT)</strong> em vez de senha. Gere em <em>Settings → Developer settings → Personal access tokens</em> e use-o quando o Git pedir a senha.
</blockquote>
---

<h2 id="clonar-sync">6. Clonando e sincronizando</h2>

![G_8](/assets/img/git/g_8.png)  
Clonar um repositório existente:

<pre>git clone https://github.com/usuario/projeto.git
cd projeto</pre>

![G_9](/assets/img/git/g_9.png)  
Trazer mudanças do remoto:

<pre>git pull</pre>

<blockquote class="tip">
Prefere <em>rebase</em> por padrão ao puxar?
<pre>git config --global pull.rebase true</pre>
</blockquote>

![G_10](/assets/img/git/g_10.png)  
Enviar suas mudanças:

<pre>git push</pre>

![G_11](/assets/img/git/g_11.png)

E no seu GitHub, o repo aparece atualizado bonitinho.

---

<h2 id="erros">7. Erros comuns e como corrigir</h2>

Alguns perrengues que você provavelmente vai encontrar no começo:

- <strong>Erro:</strong> <code style="color:red"><strong>fatal: not a git repository</strong></code>  
  Você esqueceu de rodar <code>git init</code> ou está fora da pasta do projeto.  
  Entre na pasta correta ou rode <code>git init</code>.

- <strong>Erro:</strong> <code style="color:red"><strong>fatal: remote origin already exists</strong></code>  
  Você já adicionou o remoto antes.  
  Use:  
  <pre>git remote remove origin
git remote add origin https://github.com/usuario/projeto.git</pre>

- <strong>Erro:</strong> <code style="color:red">failed to push some refs</code>  
  O repositório remoto tem commits que você não tem localmente.  
  Rode:  
  <pre>git pull --rebase origin main</pre>
  Depois, tente o <code>git push</code> novamente.

- <strong>Erro:</strong> Conflito de merge (<code style="color:red"><strong>CONFLICT</strong></code>)  
  Duas pessoas alteraram o mesmo arquivo na mesma parte.  
  Abra o arquivo, resolva os <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> e <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>, salve e depois:  
  <pre>git add nome_do_arquivo
git commit -m "fix: resolve merge conflict"</pre>
  <em>(Se estava rebaseando, use <code>git rebase --continue</code> após o <code>git add</code>.)</em>

# Comandos básicos do Git e que você vai usar!
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
        <td><code>git config --global user.name "Seu Nome"</code></td>
        <td>Define seu nome globalmente</td>
      </tr>
      <tr>
        <td><code>git config --global user.email "seu@email.com"</code></td>
        <td>Define seu e-mail globalmente</td>
      </tr>
      <tr>
        <td><code>git config --list</code></td>
        <td>Mostra todas as configurações</td>
      </tr>
      <tr>
        <td><code>git init</code></td>
        <td>Cria um novo repositório Git na pasta atual</td>
      </tr>
      <tr>
        <td><code>git clone URL</code></td>
        <td>Baixa um repositório existente (ex.: do GitHub)</td>
      </tr>
      <tr>
        <td><code>git status</code></td>
        <td>Mostra arquivos modificados, adicionados ou pendentes</td>
      </tr>
      <tr>
        <td><code>git log</code></td>
        <td>Mostra o histórico completo de commits</td>
      </tr>
      <tr>
        <td><code>git log --oneline --graph --decorate --all</code></td>
        <td>Histórico resumido e visual</td>
      </tr>
      <tr>
        <td><code>git diff</code></td>
        <td>Mostra o que foi alterado antes de commitar</td>
      </tr>
      <tr>
        <td><code>git add arquivo.txt</code></td>
        <td>Adiciona um arquivo para o próximo commit</td>
      </tr>
      <tr>
        <td><code>git add .</code></td>
        <td>Adiciona todos os arquivos modificados</td>
      </tr>
      <tr>
        <td><code>git commit -m "mensagem"</code></td>
        <td>Salva as mudanças no histórico com uma mensagem</td>
      </tr>
      <tr>
        <td><code>git commit --amend</code></td>
        <td>Edita o último commit (mensagem ou arquivos)</td>
      </tr>
      <tr>
        <td><code>git remote add origin URL</code></td>
        <td>Conecta o projeto local a um repositório remoto</td>
      </tr>
      <tr>
        <td><code>git remote -v</code></td>
        <td>Lista os repositórios remotos configurados</td>
      </tr>
      <tr>
        <td><code>git push origin main</code></td>
        <td>Envia as alterações locais para o GitHub</td>
      </tr>
      <tr>
        <td><code>git pull origin main</code></td>
        <td>Baixa atualizações do GitHub para sua máquina</td>
      </tr>
      <tr>
        <td><code>git fetch</code></td>
        <td>Busca mudanças do remoto sem mesclar automaticamente</td>
      </tr>
      <tr>
        <td><code>git branch</code></td>
        <td>Lista as branches existentes</td>
      </tr>
      <tr>
        <td><code>git branch nome</code></td>
        <td>Cria uma nova branch</td>
      </tr>
      <tr>
        <td><code>git checkout nome</code></td>
        <td>Muda para outra branch</td>
      </tr>
      <tr>
        <td><code>git checkout -b nome</code></td>
        <td>Cria e já muda para uma branch nova</td>
      </tr>
      <tr>
        <td><code>git merge nome</code></td>
        <td>Mescla a branch <code>nome</code> na branch atual</td>
      </tr>
      <tr>
        <td><code>git branch -d nome</code></td>
        <td>Apaga a branch local</td>
      </tr>
      <tr>
        <td><code>git checkout -- arquivo.txt</code></td>
        <td>Desfaz mudanças em um arquivo</td>
      </tr>
      <tr>
        <td><code>git reset --soft HEAD~1</code></td>
        <td>Desfaz o último commit, mas mantém os arquivos</td>
      </tr>
      <tr>
        <td><code>git reset --hard HEAD~1</code></td>
        <td>Desfaz o último commit e apaga as mudanças</td>
      </tr>
      <tr>
        <td><code>git revert (hash)</code></td>
        <td>Cria um novo commit que desfaz as mudanças de um commit anterior</td>
      </tr>
      <tr>
        <td><code>.gitignore</code></td>
        <td>Define arquivos/pastas que o Git deve ignorar (ex.: <code>node_modules/</code>, <code>*.log</code>, <code>.env</code>)</td>
      </tr>
    </tbody>
  </table>
</div>

---

<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXgxZmZibmo1ZWRqOW83YzViYWpmdzV2a2VvNjN3MmM1enJxOWZiNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/j5Qgf8rf2VYnoWH3SY/giphy.gif" alt="Gif engraçado sobre Git" width="220" style="display:block; margin:1rem auto;">

<p>
  Viu só? O <strong>Git</strong> não é nenhum bicho de sete cabeças!<br>
  No começo pode parecer confuso, mas depois que pega o jeito vira automático.
</p>

<p>
  Até a próxima, e lembre-se: <strong>commit cedo e commit sempre!</strong>
</p>

---


Dê um suporte ao meu projeto. Doe um cafézinho ☕.<br>
Pix: biologolee@gmail.com<br>
Bitcoin: bc1qg7qrfhclzt3sm60en53qv8fmwpuacfaxt5v55k

![QR Code](/assets/img/meus_projetos/bluewallet_qrcode.png)


---

# Referências

1. <a href="https://git-scm.com/doc" target="_blank">Documentação oficial do Git</a>  
2. <a href="https://docs.github.com/pt" target="_blank">Documentação do GitHub</a>  
