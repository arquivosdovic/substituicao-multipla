# Substituição Múltipla de Texto

Uma ferramenta simples e direta, desenvolvida em HTML, CSS e JavaScript, para aplicar várias regras de substituição em qualquer texto. Ideal para automações rápidas, padronização de documentos, correções em massa ou qualquer tarefa que envolva trocar múltiplos termos de uma só vez.

## ✨ Funcionalidades
- Criar e remover regras de substituição dinamicamente  
- Executar todas as substituições com um único clique  
- Importar regras a partir de arquivos `.json`  
- Exportar regras definidas para `.json`  
- Área dedicada para inserir o texto original  
- Campo com o resultado pronto para copiar  
- Interface simples, intuitiva e responsiva  

## 📁 Estrutura do Projeto
```
/
├── index.html
├── styles.css
├── script.js
└── regras.json (opcional)
```

## 🚀 Como Usar
1. Abra o arquivo `index.html` no navegador.  
2. Adicione quantas regras desejar, definindo o termo antigo e o novo.  
3. Escreva ou cole o texto na área principal.  
4. Clique em **Executar Substituição** para gerar o resultado.  
5. Copie o texto final pelo botão dedicado.  
6. Caso precise, importe ou exporte regras em formato JSON.

## 📦 Importação e Exportação de Regras

- **Exportar:** salva todas as regras configuradas em um arquivo `.json`.  
- **Importar:** carrega automaticamente as regras enviadas.

Exemplo de estrutura:
```json
[
  { "antigo": "exemplo", "novo": "modelo" },
  { "antigo": "teste", "novo": "amostra" }
]
```

## 🛠️ Tecnologias Utilizadas
- HTML5  
- CSS3  
- JavaScript Vanilla

## 📝 Licença
Este projeto está disponível sob a licença MIT.
