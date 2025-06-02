document.addEventListener('DOMContentLoaded', () => {
    const viewerContainer = document.getElementById('viewer-container');
    const ifcFileInput = document.getElementById('ifc-file-input');
    const loadButton = document.getElementById('load-button');

    let viewer; // Variável para armazenar a instância do viewer

    // Inicializa o viewer OxeKit
    function initializeViewer() {
        if (viewer) {
            viewer.dispose(); // Descarta o viewer existente se houver
        }
        viewer = new OxeKit.Viewer(viewerContainer);
        viewer.initialize(); // Inicializa a cena, câmera, etc.
        console.log('OxeKit Viewer inicializado.');

        // Opcional: Adicione um evento para quando o modelo é carregado
        viewer.events.on('loaded', () => {
            console.log('Modelo IFC carregado com sucesso!');
        });

        // Opcional: Adicione um evento para seleção de elementos
        viewer.events.on('pick', (selection) => {
            if (selection.element) {
                console.log('Elemento selecionado:', selection.element.name, selection.element.id);
                // Você pode exibir as propriedades do elemento em uma UI separada aqui
            }
        });
    }

    // Chama a inicialização do viewer assim que o DOM estiver carregado
    initializeViewer();

    // Função para carregar o arquivo IFC
    async function loadIfcFile(file) {
        if (!file) {
            alert('Por favor, selecione um arquivo IFC.');
            return;
        }

        const url = URL.createObjectURL(file);
        try {
            // Limpa qualquer modelo existente antes de carregar um novo
            if (viewer.models.length > 0) {
                viewer.removeModel(viewer.models[0]); // Remove o primeiro modelo se houver
            }
            await viewer.load(url);
            console.log('Tentando carregar IFC de:', url);
            // O viewer.events.on('loaded') será acionado se o carregamento for bem-sucedido
        } catch (error) {
            console.error('Erro ao carregar arquivo IFC:', error);
            alert('Erro ao carregar o arquivo IFC. Verifique o console para detalhes.');
        } finally {
            URL.revokeObjectURL(url); // Libera o objeto URL
        }
    }

    // Event listener para o botão de carregar
    loadButton.addEventListener('click', () => {
        const file = ifcFileInput.files[0];
        loadIfcFile(file);
    });

    // Opcional: Carregar um arquivo IFC padrão ao iniciar (se você tiver um na pasta ifc-models)
    // Para isso, você precisaria de um servidor local para servir a pasta `ifc-models`
    // ou fazer o upload do arquivo para o GitHub e referenciá-lo diretamente
    // Exemplo:
    // async function loadDefaultIfc() {
    //     try {
    //         // Certifique-se de que o caminho esteja correto em relação ao seu index.html
    //         await viewer.load('./ifc-models/meu_modelo.ifc');
    //         console.log('Modelo padrão carregado.');
    //     } catch (error) {
    //         console.error('Erro ao carregar modelo IFC padrão:', error);
    //     }
    // }
    // loadDefaultIfc(); // Descomente para carregar um modelo padrão
});