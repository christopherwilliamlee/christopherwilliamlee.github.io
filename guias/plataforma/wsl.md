---
layout: guia
title: Tutorial de instalação do Windows Subsystem for Linux (WSL)
permalink: /guias/plataforma/wsl/
---

![Etapa - 15 WSL](/assets/img/wsl/wsl_logo_1.png)

# <u>Instalação do WSL (Windows Subsystem for Linux) no Windows</u>

<p style="text-align: justify">
  Fala pessoal, aqui eu vou ensinar vocês a instalarem o <strong>WSL</strong> na máquina de vocês.  
  Ele é extremamente útil pra quem não quer trabalhar com dual boot ou máquina virtual.  
  Eu mesmo já tentei usar o Ubuntu como sistema principal, mas tive problemas com alguns softwares e jogos (quem nunca, né?).  
  Por isso, acho muito mais viável trabalhar com o WSL.  
  Nesse tutorial você vai aprender a instalar o WSL no Windows. É bem simples e, sério, faz muita diferença!
</p>

<img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXZkNndpenJjNjhkM3BtcHUwdm14ejM5OHNldWk5ZDZxb2ZoMnU3YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oEduZtPOv5OSecubu/giphy.gif" alt="gif" width="220" style="display:block; margin:auto;">

O que você vai precisar <u>antes</u>:

- **Windows 10 versão 2004 (Build 19041)** ou superior  
- **Conta de administrador no Windows**  
- **Conexão com internet** para baixar pacotes  

---

# <u>O que é o WSL?</u>

<p>
  O <strong>WSL (Windows Subsystem for Linux)</strong> permite rodar distribuições Linux diretamente no Windows, sem precisar de máquina virtual ou dual boot.  
  É extremamente útil para bioinformática e desenvolvimento, pois você pode usar o Ubuntu com as ferramentas de linha de comando e ainda manter seus programas do Windows.
</p>

---

## Passo a passo
1. [Verificar versão do Windows](#verificar-versao)  
2. [Instalar o WSL](#instalar-wsl)  
3. [Cadastrar login e senha](#cadastrar-login)  
4. [Ativar o WSL (caso dê erro)](#ativar-wsl)  
5. [Erros comuns](#erros)

---

<h2 id="verificar-versao">1. Verificar versão do Windows</h2>

O WSL 2 funciona a partir do **Windows 10 versão 2004 (Build 19041)** ou superior. Para verificar, pressione:

<pre>Win + R → digite winver → Enter</pre>

Algo como isso deverá aparecer:

![WSL 1](/assets/img/wsl/wsl_1.png)

---

<h2 id="instalar-wsl">2. Instalar o WSL</h2>

Acesse o site oficial do <a href="https://ubuntu.com/desktop/wsl" target="_blank">Ubuntu</a>.  
Clique em **Download Ubuntu on WSL**.

![WSL 2](/assets/img/wsl/wsl_2.png)

Localize o arquivo baixado (geralmente na pasta Downloads).

![WSL 3](/assets/img/wsl/wsl_3.png)

Clique duas vezes sobre o instalador:

![WSL 4](/assets/img/wsl/wsl_4.png)

Ele começará a instalar automaticamente.

![WSL 5](/assets/img/wsl/wsl_5.png)

<blockquote class="info">
<strong>Nota:</strong> Algumas telas podem ter mudado nas versões mais recentes do WSL.  
Se algo der errado aqui, pule para a etapa <a href="#ativar-wsl">Ativar o WSL</a>.
</blockquote>

---

<h2 id="cadastrar-login">3. Cadastrar login e senha</h2>

![Arquivo de instalação baixado](/assets/img/wsl/wsl_6.png)

Ao finalizar, o Ubuntu pedirá que você insira um nome de usuário e senha.  
<blockquote class="info">
A senha não aparece na tela quando digitada, mas está sendo registrada. Digite com atenção!
</blockquote>

![Arquivo de instalação baixado](/assets/img/wsl/wsl_7.png)

Se aparecer a mensagem:

<pre>passwd: password updated successfully</pre>

Pronto! Seu WSL está pronto para uso.

---

<h2 id="ativar-wsl">4. Ativar o WSL (Etapa adicional)</h2>

Caso as etapas anteriores não funcionem, siga este processo:

![Etapa - 8 WSL](/assets/img/wsl/wsl_8.png)  
Pesquise por <code>powershell</code>, clique com o botão direito e execute como administrador.

![Etapa - 9 WSL](/assets/img/wsl/wsl_9.png)  
No PowerShell, rode:

<pre>wsl --install</pre>

![Etapa - 10 WSL](/assets/img/wsl/wsl_10.png)  

Depois, vá no **Painel de Controle → Programas → Ativar ou desativar recursos do Windows**.

![Etapa - 11 WSL](/assets/img/wsl/wsl_11.png)  
![Etapa - 12 WSL](/assets/img/wsl/wsl_12.png)

Ative a opção <strong>Subsistema do Windows para Linux</strong>.  
Reinicie o computador e procure por **Ubuntu** no menu iniciar.

---

<h2 id="erros">5. Erros comuns</h2>

- Erro 0x80070002
![Etapa - 13 WSL](/assets/img/wsl/wsl_13.png)

Causa: O Windows não encontra os arquivos necessários.  
Solução:
<pre>wsl --install</pre>
Atualize o Windows, reinicie o PC e tente novamente.

---

- Erro 0x800701bc
![Etapa - 14 WSL](/assets/img/wsl/wsl_14.png)

Causa: Kernel do WSL desatualizado.  
Solução:  
Baixe o kernel mais recente: <a href="https://aka.ms/wsl2kernel" target="_blank">https://aka.ms/wsl2kernel</a>  
Reinicie o PC e tente novamente.

---

- Erro 0x80370102
![Etapa - 15 WSL](/assets/img/wsl/wsl_15.png)

Causa: Virtualização não habilitada no BIOS.  
Solução:  
Habilite Intel VT-x ou AMD-V no BIOS.  
Ative também os recursos do Windows com:
<pre>dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart</pre>
Reinicie o PC e tente novamente.

---

<p>
Espero que vocês valorizem esse trabalho aqui.  
Pra fazer esse tutorial do zero, eu precisei reinstalar o WSL e acabei perdendo meus projetos locais.  
Ainda bem que a maioria estava no GitHub! 😅  
Boa sorte na jornada de vocês e qualquer dúvida, podem me enviar e-mail.
</p>

Até a próxima!

<img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXpybmFyM2EzYmgxcDdwMHVpajExcjJ1aWp0dnh1OXRvZXhyM3lveSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l1J3CbFgn5o7DGRuE/giphy.gif" alt="gif" width="250" style="display:block; margin:auto;">

---

Se curtiu, dá aquele apoio no <a href="https://www.linkedin.com/in/christopher-lee-390643197/" target="_blank">LinkedIn</a> e considere um cafézinho ☕ para manter o projeto vivo. Valeu!

Pix: [biologolee@gmail.com](mailto:biologolee@gmail.com)<br>
Bitcoin: bc1qg7qrfhclzt3sm60en53qv8fmwpuacfaxt5v55k  

![QR Code](/assets/img/meus_projetos/bluewallet_qrcode.png)

---

## Referências

1. <a href="https://learn.microsoft.com/pt-br/windows/wsl/" target="_blank">Documentação oficial do WSL</a>  
2. <a href="https://aka.ms/wsl2kernel" target="_blank">Download do kernel atualizado</a>
