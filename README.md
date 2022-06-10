# Inteli - Instituto de Tecnologia e Liderança 

<p align="center">
<a href= "https://www.inteli.edu.br/"><img src="https://www.inteli.edu.br/wp-content/uploads/2021/08/20172028/marca_1-2.png" alt="Inteli - Instituto de Tecnologia e Liderança" border="0"></a>
</p>

#Antecipa já

Web Thinkers

## Integrantes: <a href="https://www.linkedin.com/in/andrelessajr/">André Luís Lessa Junior</a>, <a href="https://www.linkedin.com/in/camila-anacleto-63101312b/">Camila Fernanda de Lima Anacleto</a>, <a href="https://www.linkedin.com/in/eliasbiondo/">	Elias Biondo</a>, <a href="https://www.linkedin.com/in/kaique-ramon-6975751a3/">Kaique Ramon Nogueira Dantas</a>, <a href="https://www.linkedin.com/in/matheus-fidelis-680520232/">Matheus Fidelis dos Santos Pinto</a>, <a href="https://www.linkedin.com/in/uelitonrocha">Ueliton Moreira Rocha</a>

## Descrição

Para este módulo tivemos como parceiro de projeto a Hurb, uma empresa que detém uma plataforma de reserva de hotéis e vendas de pacotes de viagem. Nela, as redes hoteleiras recebem os repasses das estadias dos clientes, sem taxa, somente após 30 dias dos checkouts (D+30). Porém, existe a possibilidade de os hotéis anteciparem os seus recebimentos em troca de uma taxa que varia com a urgência da antecipação (D+2, D+7, D+15). Esse sistema, atualmente, é completamente manual e controlado por somente uma equipe. Sendo assim, o objetivo do projeto é criar um programa que controle os pedidos de antecipação dos hotéis e repasse para o financeiro da Hurb de forma automática e instantânea. 
<br><br>
Meu projeto é um exemplo de como utilizar o github.
<br><br>
<p align="center">
<img src="" alt="Web Thinkers" border="0">
  *Imagem do site*
</p>


Então, para atingirmos o objetivo da Hurb, começamos por introduzir uma tela de login dos usuários já cadastrados no sistema delas, assim como os administradores da própria Hurb. Tudo isso protegido por um sistema de verificação de duas etapas. 

Na área de usuários, a primeira opção que tem é para selecionar o hotel em questão (caso a rede possua mais que um). Após isso, o aplicativo irá mostrar a quantidade de checkouts e o valor totais pendentes. Caso o usuário queira solicitar uma antecipação, o programa faz uma simulação em que o hotel informa em quantos dias e qual valor quer receber. Com isso, o aplicativo retorna o valor a ser recebido, a taxa e a quantidade de diárias e números de pedidos que compõem tal antecipação (ou seja, retorna um resumo do pedido). Se o usuário resolva concluir o pedido, o programa abre uma página para informar os dados bancários ou pix para a conclusão da transferência. Por fim, existe uma aba de calendário para o usuário monitorar os dias de recebimento e o valor total das antecipações de cada mês. 

Já a área dos administradores (funcionários da Hurb) é voltada completamente para o controle gerencial de todos os usuários. Foram criadas abas como: cadastrar novo usuário, registrar novo parceiro, criar novo estabelecimento/reserva e criar nova modalidade. Tudo isso, gerando bancos de dados que irão para o aplicativo e para os departamentos responsáveis. Além da principal aba, que é gerenciar solicitação; onde o administrador vai poder ver todos os pedidos de antecipação (com o nome do usuário, estabelecimento, modalidade de antecipação, valor e tipo de transferência). Por fim, foi também criada uma aba de estatísticas para a coleta e análise de dados pela Hurb. 

Desta forma, concluímos o projeto e acreditamos atender todos os pedidos e necessidades de nosso parceiro. 
<br><br>

## 🛠 Estrutura de pastas

-Raiz<br>
|<br>
|-->documentos<br>
 &emsp;|-->antigos<br>  
|-->imagens<br>
|-->src<br>
  &emsp;|-->Backend<br>
  &emsp;|-->Frontend<br>
|.gitignore<br>
|readme.md<br>

A pasta raiz contem dois arquivos que devem ser alterados:

<b>README.MD</b>: Arquivo que serve como guia e explicação geral sobre seu projeto. O mesmo que você está lendo agora.

Há também 4 pastas que seguem da seguinte forma:

<b>documentos</b>: Aqui estarão todos os documentos do projeto, mas principalmente o <b>Documentação do Sistema</b>. Há uma pasta <b>antigos</b> onde estarão todas as versões antigas da documentação.

<b>executáveis</b>: Aqui estarão todos os executáveis do jogo, prontos para rodar. Há no mínimo 3 pastas, uma para binários <b>Windows</b>, uma para binários <b>android</b> e uma para a <b>Web/HTML</b>

<b>imagens</b>: Algumas imagens do jogo/sistema e logos prontos para serem utilizados e visualizados.

<b>src</b>: Nesta pasta irá todo o código fonte do sistema, pronto para para ser baixado e modificado. Existem duas pastas, <b>Backend</b> e <b>Frintend</b> que devem conter, respectivamente, o código do servidor e o código da página web.<br>


## 📈 Exemplo de uso

Alguns exemplos interessantes e úteis sobre como seu projeto pode ser utilizado.

Adicione blocos de códigos e, se necessário, screenshots.

Este modelo pode ser copiado e utilizado à vontade.

Através da cópia/clone/ download do repositório, altere os dados do readme.md e carregue os arquivos de seu projeto.

## 💻 Configuração para Desenvolvimento

Descreva como instalar todas as dependências para desenvolvimento e como rodar um test-suite automatizado de algum tipo. Se necessário, faça isso para múltiplas plataformas.

Para abrir este projeto você necessita das seguintes ferramentas:

-<a href="https://godotengine.org/download">GODOT</a>

```sh
make install
npm test
Coloque código do prompt de comnando se for necessário
```

## 🗃 Histórico de lançamentos

A cada atualização os detalhes devem ser lançados aqui.

* 0.2.1 - 25/01/2022
    * MUDANÇA: Atualização de docs (código do módulo permanece inalterado)
* 0.2.0 - 15/01/2022
    * MUDANÇA: Remove `setDefaultXYZ()`
    * ADD: Adiciona `init()`
* 0.1.1 - 11/01/2022
    * CONSERTADO: Crash quando chama `baz()` (Obrigado @NomeDoContribuidorGeneroso!)
* 0.1.0 - 10/01/2022
    * O primeiro lançamento adequado
    * MUDANÇA: Renomeia `foo()` para `bar()`
* 0.0.1 - 01/01/2022
    * Trabalho em andamento

## 📋 Licença/License

<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://github.com/Spidus/Teste_Final_1">MODELO GIT INTELI</a> by <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://www.yggbrasil.com.br/vr">INTELI, VICTOR BRUNO ALEXANDER ROSETTI DE QUIROZ</a> is licensed under <a href="http://creativecommons.org/licenses/by/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">Attribution 4.0 International<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"></a></p>

## 🎓 Referências

Aqui estão as referências usadas no projeto.

1. <https://github.com/iuricode/readme-template>
2. <https://github.com/gabrieldejesus/readme-model>
3. <https://creativecommons.org/share-your-work/>
4. <https://freesound.org/>
5. Músicas por: <a href="https://freesound.org/people/DaveJf/sounds/616544/"> DaveJf </a> e <a href="https://freesound.org/people/DRFX/sounds/338986/"> DRFX </a> ambas com Licença CC 0.
