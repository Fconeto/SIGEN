CREATE PROCEDURE InsertLocalidade
    @CodigoDaLocalidade BIGINT,
    @Nome NVARCHAR(255),
    @Categoria NVARCHAR(100),
    @DataDeRegistro DATETIME,
    @DataDeAtualização DATETIME,
    @CriadoPor BIGINT,
    @AtualizadoPor BIGINT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Localidade (
        CodigoDaLocalidade,
        Nome,
        Categoria,
        DataDeRegistro,
        DataDeAtualizacao,
        CriadoPor,
        AtualizadoPor
    )
    VALUES (
        @CodigoDaLocalidade,
        @Nome,
        @Categoria,
        @DataDeRegistro,
        @DataDeAtualização,
        @CriadoPor,
        @AtualizadoPor
    );
END