$(document).ready(function() {
    // Event listener for submit button click
    $('#submitButtonId').on('click', function(e) {
        e.preventDefault(); // Impede o envio padrão do formulário

        // Captura os valores dos checkboxes marcados
        const selectedShifts = [];
        if ($('#manha').is(':checked')) {
            selectedShifts.push($('#manha').val()); // Adiciona o valor (ID do turno) ao array
        }
        if ($('#tarde').is(':checked')) {
            selectedShifts.push($('#tarde').val()); // Adiciona o valor (ID do turno) ao array
        }
        if ($('#noite').is(':checked')) {
            selectedShifts.push($('#noite').val()); // Adiciona o valor (ID do turno) ao array
        }

        // Captura os dados do formulário
        const eventName = $('#calendar_event_name').val();
        const startDate = new Date($('#kt_calendar_datepicker_start_date').val()).toISOString(); // Converte para ISO
        const endDate = new Date($('#kt_calendar_datepicker_end_date').val()).toISOString(); // Converte para ISO

        // Define os IDs de espaço e usuário (substitua por seus próprios valores)
        // Use the function to get the UUID from the URL
        const spaceUUID = getQueryParam('uuid-reserva');
        //const spaceId = 'a903226e-03f3-4a46-b244-4958fadde119'; // Exemplo de ID de espaço
        const userId = '04fd1c01-64aa-4715-afcf-58e6ff0196fe'; // Exemplo de ID de usuário

        // Cria o objeto de dados da reserva
        const reservationData = {
            startDate: startDate,
            endDate: endDate,
            status: "false", // Você pode definir a lógica para o status aqui
            details: eventName,
            spaceId: spaceUUID,
            userId: userId,
            shiftIds: selectedShifts // Adiciona os turnos selecionados (IDs)
        };

        // Mostra os dados da reserva em formato JSON para depuração
        console.log('JSON da Reserva:', JSON.stringify(reservationData, null, 2));

        fetch('http://localhost:8000/reservation', { // Ajuste para seu endpoint de criação
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservationData),
        })
        .then(response => {
            return response.json().then(data => {
                if (!response.ok) {
                    // Verifica os códigos de status HTTP para dar feedback mais específico
                    switch (response.status) {
                        case 404:
                            alert(data.message); // Mostra alerta de erro específico
                            break;
                        case 500:
                            alert(data.message); // Mostra alerta de erro do servidor
                            break;
                        default:
                            throw new Error('Ocorreu um erro inesperado. Tente novamente.');
                    }
                } else {
                    alert(data.message); // Mostra a mensagem de sucesso
                    location.reload(); // Recarrega a página após sucesso
                }
                return data; // Retorna os dados para outro tratamento se necessário
            });
        })
        .catch((error) => {
            console.error('Error:', error);
            alert(error.message); // Mostra alerta de erro personalizado
        });
        
        

        // Fecha o modal após a submissão
        $('#dateRangeModal').modal('hide');
    });

    // Função para buscar eventos da API
    async function fetchEventsFromAPI() {
        try {
            const response = await fetch('http://localhost:8000/reservation/list-all-reservations'); // Endpoint para buscar eventos
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const eventsFromAPI = await response.json();
            return eventsFromAPI;
        } catch (error) {
            console.error('Error fetching events:', error);
            return []; // Retorna um array vazio se houver um erro
        }
    }

    // Function to get the query parameter by name
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Inicializa o FullCalendar
    async function initializeCalendar() {
        const eventsFromAPI = await fetchEventsFromAPI(); // Busca eventos

        $("#calendar").fullCalendar({
            header: {
                left: "title",
                center: "agendaDay,agendaWeek,month",
                right: "prev,next today"
            },
            editable: true,
            firstDay: 1,
            selectable: true, // Permite seleção de intervalo de datas
            selectHelper: true,
            defaultView: "month",
            axisFormat: "h:mm",
            allDaySlot: false,

            // Define eventos
            events: eventsFromAPI.flatMap(function(event) {
                return event.shift.map(function(shift) {
                    // Determina className com base no status
                    var eventClass = event.status === "false" ? "important" : "success";

                    return {
                        title: `Reserva: ${event.details}, Turno: ${shift.nameShift}`,
                        start: new Date(event.startDate).toISOString(), // Corrigido para obter ISO
                        end: new Date(event.endDate).toISOString(), // Corrigido para obter ISO
                        allDay: true, // Torna o evento um evento de dia inteiro
                        className: eventClass
                    };
                });
            }),

            // Manipula o evento de seleção para capturar o início e o fim da data do intervalo selecionado
            select: function(start, end) {
                const formattedStartDate = start.toISOString().split('T')[0]; // Obtém a data de início
                const formattedEndDate = end.toISOString().split('T')[0]; // Obtém a data de fim (exclusiva)

                // Preenche os campos de entrada do modal com as datas selecionadas
                $('#kt_calendar_datepicker_start_date').val(formattedStartDate);
                $('#kt_calendar_datepicker_end_date').val(formattedEndDate);

                // Mostra o modal
                $('#dateRangeModal').modal('show');
            }
        });
    }

    // Chama a função para inicializar o calendário
    initializeCalendar();
});
