document.addEventListener('DOMContentLoaded', () => {
  const regrasContainer = document.getElementById('regras-container');
  const adicionarRegraBtn = document.getElementById('adicionar-regra');
  const executarBtn = document.getElementById('executar-substituicao');
  const textoPrincipal = document.getElementById('texto-principal');
  const textoResultado = document.getElementById('texto-resultado');
  const exportarBtn = document.getElementById('exportar-regras');
  const importarInput = document.getElementById('importar-input');

  // --- FUNÇÃO DE AJUDA PARA ESCAPAR ASPAS EM HTML ---
  /**
   * Escapa caracteres especiais de HTML, como aspas, para que possam ser
   * inseridos com segurança no atributo 'value' de um <input>.
   * @param {string} str - A string a ser escapada.
   * @returns {string} A string escapada.
   */
  function escapeHtmlAttribute(str) {
    // Escapa aspas duplas (") com &quot; e aspas simples (') com &#39;
    return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  // ------------------------------------------

  // --- FUNÇÕES DE INTERFACE ---

  /**
   * Cria e retorna um novo elemento de regra (Termo Antigo/Novo).
   * Usa valores escapados para evitar quebra de HTML (como a que ocorreu).
   * @param {string} antigo - O valor inicial para o termo antigo.
   * @param {string} novo - O valor inicial para o novo termo.
   */
  function criarRegraItem(antigo = '', novo = '') {
    // 1. ESCAPA os valores antes de inseri-los no atributo 'value'
    const antigoEscapado = escapeHtmlAttribute(antigo);
    const novoEscapado = escapeHtmlAttribute(novo);

    const div = document.createElement('div');
    div.className = 'regra-item';

    // 2. Utiliza os valores escapados no HTML
    div.innerHTML = `
            <input type="text" class="termo-antigo" placeholder="Termo a Substituir (Antigo)" value="${antigoEscapado}">
            <input type="text" class="termo-novo" placeholder="Novo Termo" value="${novoEscapado}">
            <button class="remover-regra" onclick="removerRegra(this)">Remover</button>
        `;
    return div;
  }

  // Inicia com uma regra vazia se o container estiver vazio
  if (regrasContainer.children.length === 0) {
    regrasContainer.appendChild(criarRegraItem());
  }

  // Adiciona uma nova regra ao container
  adicionarRegraBtn.addEventListener('click', () => {
    regrasContainer.appendChild(criarRegraItem());
  });

  // Função global para remover a regra (chamada pelo onclick no HTML)
  window.removerRegra = (button) => {
    button.closest('.regra-item').remove();
  };

  // --- FUNÇÕES DE PROCESSAMENTO E COLETA ---

  /**
   * Coleta todas as regras da interface e as transforma em um array de objetos.
   * @returns {Array<{antigo: string, novo: string}>} Lista de regras válidas.
   */
  function coletarRegras() {
    const regras = [];
    const regraItems = regrasContainer.querySelectorAll('.regra-item');

    regraItems.forEach((regra) => {
      const termoAntigo = regra.querySelector('.termo-antigo').value.trim();
      const termoNovo = regra.querySelector('.termo-novo').value;

      // Adiciona apenas se o termo antigo não estiver vazio
      if (termoAntigo !== '') {
        regras.push({ antigo: termoAntigo, novo: termoNovo });
      }
    });
    return regras;
  }

  // Função para executar a substituição
  executarBtn.addEventListener('click', () => {
    let texto = textoPrincipal.value;
    const regras = coletarRegras();

    regras.forEach((regra) => {
      try {
        // 'g' = global (substitui todas), 'i' = case-insensitive
        // Atenção: Strings de HTML longas podem ser lentas para processar com RegEx
        const regex = new RegExp(regra.antigo, 'gi');
        texto = texto.replace(regex, regra.novo);
      } catch (e) {
        console.error('Erro ao processar expressão regular:', regra.antigo, e);
        alert(
          `Erro! Falha ao aplicar a regra "${regra.antigo}". Verifique se o termo contém caracteres especiais de Regex (como \\, *, +) que precisam de escape (\\).`
        );
      }
    });

    textoResultado.value = texto;
  });

  // Função para copiar o resultado
  window.copiarResultado = () => {
    textoResultado.select();
    try {
      document.execCommand('copy');
      alert('Resultado copiado para a área de transferência!');
    } catch (err) {
      console.error('Falha ao copiar:', err);
      alert('Falha ao copiar. Por favor, copie o texto manualmente.');
    }
  };

  // --- FUNÇÕES DE IMPORTAR/EXPORTAR ---

  // 1. EXPORTAR REGRAS (Salva em arquivo .json)
  exportarBtn.addEventListener('click', () => {
    const regras = coletarRegras();
    if (regras.length === 0) {
      alert('Não há regras para exportar.');
      return;
    }

    const jsonContent = JSON.stringify(regras, null, 2);

    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'regras_substituicao.json';
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // 2. IMPORTAR REGRAS (Lê de arquivo .json)
  importarInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const regrasImportadas = JSON.parse(e.target.result);

        if (!Array.isArray(regrasImportadas)) {
          throw new Error(
            'O arquivo não está no formato de lista (Array) de objetos.'
          );
        }

        // Limpa o container atual
        regrasContainer.innerHTML = '';

        let regrasAdicionadas = 0;
        regrasImportadas.forEach((regra) => {
          // Validação de formato: exige que 'antigo' e 'novo' sejam strings
          if (
            regra &&
            typeof regra.antigo === 'string' &&
            typeof regra.novo === 'string'
          ) {
            regrasContainer.appendChild(
              criarRegraItem(regra.antigo, regra.novo)
            );
            regrasAdicionadas++;
          }
        });

        if (regrasAdicionadas === 0 && regrasImportadas.length > 0) {
          alert('Nenhuma regra válida encontrada no arquivo JSON.');
        } else if (regrasAdicionadas === 0) {
          regrasContainer.appendChild(criarRegraItem()); // Adiciona uma regra vazia se nada foi importado
        } else {
          alert(`Sucesso! ${regrasAdicionadas} regras foram importadas.`);
        }
      } catch (error) {
        console.error('Erro na importação:', error);
        alert(
          `Erro ao importar regras. O arquivo pode estar corrompido ou em um formato incorreto. Detalhe: ${error.message}`
        );
      } finally {
        importarInput.value = '';
      }
    };

    reader.readAsText(file);
  });
});
