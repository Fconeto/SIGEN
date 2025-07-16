CREATE PROCEDURE UpdatePesquisaPITById
    @PitId BIGINT,
    @PesquisaId BIGINT = NULL,
    @DataDeAtualizacao DATETIME,
    @AtualizadoPor BIGINT
AS
BEGIN

    UPDATE PIT
    SET PesquisaId = @PesquisaId,
        DataDeAtualizacao = @DataDeAtualizacao,
        AtualizadoPor = @AtualizadoPor
    WHERE PitId = @PitId;
END