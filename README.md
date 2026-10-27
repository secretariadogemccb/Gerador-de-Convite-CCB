# Gerador de Convites CCB — atualização da identidade visual e formulário mobile

Esta atualização foi produzida a partir da cópia do projeto **Gerador-de-Convite-CCB-master(1).zip** previamente enviada. O repositório remoto não pôde ser consultado nesta sessão; por isso, compare eventuais alterações posteriores do GitHub antes de substituir os arquivos.

## Alterações

- A imagem **02.jpg** fornecida foi usada como arte do sistema no cabeçalho (`assets/logo-cabecalho.webp`), preservando o conteúdo da arte e retirando somente margens brancas para melhorar a exibição.
- Incluído arquivo original `assets/logo-sistema.jpg`, ícone de aba `assets/favicon.png` e ícone para adicionar à tela inicial `assets/apple-touch-icon.png`.
- Incluídas tags de pré-visualização da página (`og:image`, título e descrição). A URL indicada pressupõe o endereço padrão do GitHub Pages para este repositório.
- No celular (`max-width: 760px`), **Data do Evento**, **Dia da Semana** e **Horário** aparecem em **linhas separadas**, com espaçamento entre os campos e largura limitada à tela.
- Mantidos os demais recursos do código original: edição do convite, prévia, seleção de suportes, ajuste da imagem da igreja e JPG de 1080 × 1920 pixels.

## Atualizar o GitHub Pages

1. Faça backup dos arquivos atuais do repositório `secretariadogemccb/Gerador-de-Convite-CCB`.
2. Extraia este ZIP no computador.
3. No repositório, substitua `index.html` e `styles.css` e envie a pasta `assets` completa. Mantenha `app.js` e `tools` da versão mais recente caso o GitHub tenha alterações mais novas do que a cópia enviada; **não é preciso substituir `app.js` para corrigir esses dois itens**.
4. Confirme as alterações (`Commit changes`) na branch usada pelo GitHub Pages.
5. Abra o site novamente. Se o navegador mostrar o visual antigo, faça uma atualização forçada (`Ctrl+F5`) ou teste em uma aba anônima.

### Com Git Bash (opcional)

```bash
git add index.html styles.css assets README.md
git commit -m "Atualiza imagem do sistema e separa data e dia no mobile"
git push origin main
```

> No ZIP, os arquivos estão na raiz para facilitar o envio. Não é necessário enviar a pasta de projeto como subpasta do repositório.

## Verificação rápida no celular

- O logo CCB com megafone azul aparece na parte superior.
- As caixas **Data do Evento**, **Dia da Semana** e **Horário** aparecem uma abaixo da outra.
- O campo da data não invade o campo do dia da semana.
- A prévia continua exportando JPG.

## Observação sobre o WhatsApp

Alguns aplicativos guardam a imagem de compartilhamento em cache. Após publicar os arquivos novos, a prévia de link pode demorar a refletir a imagem atualizada. Se o projeto usa um domínio próprio ou outra URL do GitHub Pages, ajuste a tag `og:image` em `index.html` para o endereço público absoluto correto da imagem.

## Atualização: cor de fundo (27/10/2026)

- Novo campo **Cor de Fundo do Convite** logo abaixo de **Informações no Rodapé**.
- A seleção abre a paleta completa de cores do navegador (pode escolher qualquer cor RGB).
- A cor aparece imediatamente na prévia e também no arquivo JPG exportado (1080 × 1920).
- Indicador hexadecimal, botão **Restaurar branco** e redefinição ao clicar em **Limpar**.
- Campo responsivo para computador e celular; padrão permanece branco.
- Publicação: atualizar `index.html`, `app.js`, `styles.css` no GitHub Pages.

### Imagem de fundo e opacidade
Abaixo de **Informações no Rodapé**, carregue uma imagem de fundo JPG, PNG ou WEBP (até 10 MB). Ajuste sua opacidade de 0% a 100% para misturar com a **Cor de Fundo do Convite**. A imagem cobre todo o convite, mantendo proporções, e aparece tanto na prévia quanto no JPG exportado. **Remover imagem de fundo** restaura o fundo apenas com a cor escolhida.
