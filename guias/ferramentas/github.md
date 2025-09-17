---
layout: guia
title: Tutorial rápido do GitHub
permalink: /guias/ferramentas/github/
---

![GitHub _logo](/assets/img/github/github_logo.jpg)

# <u>Tutorial rápido do GitHub</u>

<p>
  Fala pessoal, hoje eu vou mostrar o <strong>básico do GitHub</strong>.<br>
  Se o Git é a máquina do tempo dos seus projetos, o GitHub é a “nuvem” onde você guarda e compartilha essa máquina do tempo com o mundo.
</p>

<p>
  É nele que você vai criar repositórios, trabalhar em equipe e ainda mostrar seus projetos pro universo. 🌍🚀
</p>

<img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWc4NXZucTMxbDd4ZnZ6bGk1ejVkYXVvNGE2b2N2Y3oyb3RxbmczbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/78XCFBGOlS6keY1Bil/giphy.gif" alt="gif" width="220" style="display:block; margin:1rem auto;">

O que você vai precisar <u>antes</u>:

- <a href="/guias/plataforma/wsl/" target="_blank"><strong>WSL/Ubuntu</strong> configurado</a>  
- <a href="/guias/ferramentas/git/" target="_blank"><strong>Git instalado</strong></a>  
- Conta no <a href="https://github.com" target="_blank"><strong>GitHub</strong></a>

---

## Passo a passo
1. [Criando sua conta](#conta)  
2. [Criando um repositório](#repositorio)  
3. [Ligando seu Git local ao GitHub](#ligando)  
4. [Primeiro push](#push)  
5. [Erros comuns](#erros)

---

<h2 id="conta">1. Criando sua conta</h2>

![GH_1](/assets/img/github/github_1.png)

1. Acesse <a href="https://github.com" target="_blank">github.com</a>.  
2. Clique em <strong>Sign up</strong>.  
3. Escolha um nome de usuário (será seu endereço no GitHub).  
4. Informe seu e-mail e senha.  
5. Confirme sua conta pelo e-mail enviado.  

<p>Pronto, você já tem uma conta no GitHub!</p>

---

<h2 id="repositorio">2. Criando um repositório</h2>

![GH_2](/assets/img/github/github_2.png)

1. No canto superior direito, clique em <strong>+ → New repository</strong>.  

![GH_3](/assets/img/github/github_3.png)
2. Escolha o nome do repositório (ex.: <code>meu_projeto</code>).  
3. Marque se será público ou privado (deixe público por enquanto).

![GH_4](/assets/img/github/github_4.png)
4. Clique em <strong>Create repository</strong>.

---

<h2 id="ligando">3. Ligando seu Git local ao GitHub</h2>

<p>No terminal, dentro da pasta do seu projeto:</p>

<pre>
git remote add origin https://github.com/usuario/meu_projeto.git
git branch -M main
</pre>

<p>Esse comando conecta o repositório que você criou no GitHub com o seu projeto local.</p>

<blockquote class="info">
<strong>HTTPS vs SSH:</strong> você pode usar HTTPS (mais simples no começo) ou configurar chaves SSH para não precisar digitar token sempre.
</blockquote>

---

<h2 id="push">4. Primeiro push</h2>

<p>Agora basta enviar seus arquivos para o GitHub:</p>

<pre>
git push -u origin main
</pre>

<p>Se tudo deu certo, seus arquivos já estão no GitHub!<br>
Entre no site e veja seu repositório.</p>

---
<h2 id="erros">5. Erros comuns</h2>

Alguns perrengues que você provavelmente vai encontrar no começo:

- <strong>Erro:</strong> <code style="color:red"><strong>fatal: Authentication failed</strong></code>  
  O GitHub não aceita mais login com senha via HTTPS.  
  <strong>Solução:</strong> crie um <em>Personal Access Token (PAT)</em> e use no lugar da senha.  
  <a href="https://docs.github.com/pt/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token" target="_blank">Como gerar um token</a>

- <strong>Erro:</strong> <code style="color:red"><strong>Permission denied (publickey)</strong></code>  
  Tentando usar SSH sem chave configurada.  
  <strong>Solução:</strong> gere uma chave e adicione ao GitHub:  
  <pre>ssh-keygen -t ed25519 -C "seu@email.com"</pre>
  Depois adicione a chave pública em <em>Settings → SSH and GPG keys</em>.

- <strong>Erro:</strong> <code style="color:red"><strong>repository not found</strong></code>  
  O link do remoto está errado ou você não tem acesso.  
  <strong>Solução:</strong> verifique a URL no GitHub e rode:  
  <pre>git remote set-url origin https://github.com/usuario/repositorio.git</pre>

- <strong>Erro:</strong> <code style="color:red"><strong>Updates were rejected</strong></code> / <code style="color:red"><strong>failed to push some refs</strong></code>  
  O repositório remoto já tem commits que não estão no seu.  
  <strong>Solução:</strong>  
  <pre>git pull --rebase origin main</pre>
  Depois, tente o <code>git push</code> novamente.

---

<img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzBhZWo2M3J3OWE3Zm0yc29nczduZGFqdTl2MWw2bHRzcDVkZ216dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cnhpl4IeYgU7MCBdV2/giphy.gif" alt="gif" width="200" style="display:block; margin:1rem auto;">

<p>
  E é isso!<br>
  Com o GitHub você consegue mostrar seus projetos, trabalhar em equipe e guardar o histórico na nuvem.<br>
  Daqui pra frente é só evoluir.
</p>

---

Dê um suporte ao meu projeto. Doe um cafézinho ☕.<br>
Pix: biologolee@gmail.com<br>
Bitcoin: bc1qg7qrfhclzt3sm60en53qv8fmwpuacfaxt5v55k

![QR Code](/assets/img/meus_projetos/bluewallet_qrcode.png)

---

# Referências

1. <a href="https://github.com" target="_blank">Site oficial do GitHub</a>  
2. <a href="https://docs.github.com/pt/get-started/quickstart" target="_blank">Guia rápido do GitHub Docs</a>
