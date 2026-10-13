# Gerador de Convites CCB — Flyer Digital

Página em **HTML5, CSS3 e JavaScript** para editar e exportar convites digitais em **JPG de 1080 × 1920 pixels**, compatível com **GitHub Pages**. Possui um servidor local opcional em **Java 21** para testes.

## Funcionalidades

- Interface fiel à referência: faixa cinza no topo, formulário à esquerda e prévia à direita.
- Responsividade: formulário e prévia organizados verticalmente no celular, sem rolagem horizontal.
- **Todos os dados do formulário começam vazios**, incluindo horário, data, nome da congregação, mensagem, endereço e rodapé. Nenhuma imagem ou suporte vem selecionado.
- A fotografia escolhida pelo usuário fica na memória do navegador; não é enviada ao servidor.
- Alterações aparecem imediatamente na prévia.
- Seleção individual de **cinco suportes**: mãos, inclusão, quebra-cabeça, EBI e autismo (imagem enviada pelo usuário). Os ícones selecionados aparecem centralizados abaixo da data/dia da semana.
- Dia da semana preenchido automaticamente após a escolha da data (mas ainda pode ser editado manualmente).
- Título e mensagem abaixo da foto quebram para novas linhas conforme necessário. O endereço e o rodapé são reposicionados automaticamente, e o conjunto é redimensionado proporcionalmente quando o conteúdo cresce muito.
- Rodapé opcional exibido somente abaixo do endereço da igreja.
- **Salvar e Compartilhar:** gera JPG 1080 × 1920; em dispositivos compatíveis, abre o compartilhamento nativo; nos demais, baixa `convite-ccb.jpg`.
- **Limpar Campos:** apaga todos os dados, a foto e os suportes marcados.

## Publicação no GitHub Pages

1. Extraia o arquivo ZIP no seu computador.
2. Acesse seu repositório no GitHub ou crie um repositório público, por exemplo `gerador-convites-ccb`.
3. Envie **o conteúdo** da pasta `gerador-convites-ccb` para a **raiz** do repositório. O `index.html` precisa ficar na raiz e a pasta `assets/icons/` deve ser mantida.
4. Confirme com **Commit changes**.
5. Acesse **Settings → Pages → Build and deployment**.
6. Em **Source**, escolha **Deploy from a branch**. Escolha `main` e `/(root)` e salve.
7. Aguarde a publicação e entre em `https://SEU-USUARIO.github.io/gerador-convites-ccb/`.
8. Se aparecer a versão antiga, atualize com **Ctrl+F5**. O GitHub Pages não executa o arquivo `ServidorLocal.java`, e não precisa dele para funcionar.

### Atualizar uma publicação já existente

Substitua `index.html`, `styles.css`, `app.js` e a pasta `assets/icons/` no repositório. Faça **Commit changes** e aguarde a publicação.

## Abrir localmente sem instalar programas

Abra `index.html` em um navegador moderno. Para garantir que os ícones sejam carregados corretamente em todos os navegadores, prefira executar o servidor local.

## Executar com Java 21 (opcional)

Abra o terminal na pasta do projeto e execute:

```bash
java --add-modules jdk.httpserver tools/ServidorLocal.java
```

Depois acesse `http://localhost:8080`.

Se a porta 8080 estiver ocupada, escolha outra:

```bash
java --add-modules jdk.httpserver tools/ServidorLocal.java 8088
```

Acesse `http://localhost:8088`.

## Arquivos

```text
gerador-convites-ccb/
├── index.html
├── styles.css
├── app.js
├── assets/
│   └── icons/
│       ├── maos.png
│       ├── sistema.png
│       ├── quebra-cabeca.png
│       ├── ebi.png
│       └── autismo.png
├── tools/
│   └── ServidorLocal.java
└── README.md
```

As fontes usam Google Fonts quando há internet e recorrem a fontes locais quando o serviço estiver indisponível. Nenhuma dependência de JavaScript externa é necessária.

