CREATE DATABASE agente_de_endemias;
GO
USE agente_de_endemias;

CREATE TABLE Agente (
    AgenteId BIGINT PRIMARY KEY IDENTITY(1,1),
    NomeDoAgente NVARCHAR(255) NOT NULL,
    Turma INT NOT NULL,
    Senha NVARCHAR(255) NOT NULL,
    Matricula BIGINT NOT NULL,
    CPF NVARCHAR(14) NOT NULL UNIQUE,
    Hierarquia INT NOT NULL,
    Tentativas INT NOT NULL DEFAULT 0,
    UltimaTentativa DATETIME NULL,
    DataDeRegistro DATETIME NOT NULL,
    DataDeAtualizacao DATETIME NOT NULL,
    CriadoPor BIGINT NOT NULL,
    AtualizadoPor BIGINT NOT NULL
);
GO

CREATE TABLE Localidade (
    LocalidadeId BIGINT PRIMARY KEY IDENTITY(1,1),
    CodigoDaLocalidade BIGINT NOT NULL UNIQUE,
    Nome NVARCHAR(255) NOT NULL,
    Categoria NVARCHAR(50) NOT NULL,
    DataDeRegistro DATETIME NOT NULL,
    DataDeAtualizacao DATETIME NOT NULL,
    CriadoPor BIGINT NOT NULL,
    AtualizadoPor BIGINT NOT NULL
);
GO

CREATE TABLE Pesquisa (
    PesquisaId BIGINT IDENTITY(1,1) PRIMARY KEY,
    ResidenciaId BIGINT NOT NULL,
    DataDaVisita DATE NOT NULL,
    Pendencia INT NOT NULL,
    NomeDoMorador NVARCHAR(255) NOT NULL,
    NumeroDeHabitantes INT NOT NULL,
    TipoDeParede INT NOT NULL,
    OutraParede NVARCHAR(255) NULL,
    TipoDeTeto INT NOT NULL,
    OutroTeto NVARCHAR(255) NULL,
    CapturaIntra BIT NOT NULL,
    CapturaPeri BIT NOT NULL,
    AnexosPositivos INT NOT NULL,
    AnexosNegativos INT NOT NULL,
    NumeroDeGatos INT NOT NULL,
    NumeroDeCachorros INT NOT NULL,
    DataDeRegistro DATETIME NOT NULL,
    DataDeAtualizacao DATETIME NOT NULL,
    CriadoPor BIGINT NOT NULL,
    AtualizadoPor BIGINT NOT NULL,
    CONSTRAINT FK_Pesquisa_Residencia FOREIGN KEY (ResidenciaId) REFERENCES Residencia(ResidenciaId)
);
GO

CREATE TABLE PIT (
    PitId BIGINT IDENTITY(1,1) PRIMARY KEY,
    AgenteId BIGINT NULL,
    NumeracaoDoPit BIGINT NOT NULL,
    Cres NVARCHAR(255) NOT NULL,
    Municipio NVARCHAR(255) NOT NULL,
    CodigoDaLocalidade BIGINT NOT NULL,
    NumeroDaCasa INT NOT NULL,
    CapturaIntra BIT NOT NULL,
    CapturaPeri BIT NOT NULL,
    LocalOndeEntrou NVARCHAR(255) NULL,
    NomeDoMorador NVARCHAR(255) NULL,
    NomeDoCapturador NVARCHAR(255) NOT NULL,
    TipoDeInseto INT NOT NULL,
    OutroTipoDeInseto NVARCHAR(255) NULL,
    NomeDoRecebedor NVARCHAR(255) NOT NULL,
    PesquisaId BIGINT NULL,
    DataDeRegistro DATETIME NOT NULL,
    DataDeAtualizacao DATETIME NOT NULL,
    CriadoPor BIGINT NOT NULL,
    AtualizadoPor BIGINT NOT NULL,
    CONSTRAINT FK_PIT_Pesquisa FOREIGN KEY (PesquisaId) REFERENCES Pesquisa(PesquisaId)
);
GO


CREATE TABLE Borrifacao (
    BorrifacaoId BIGINT IDENTITY(1,1) PRIMARY KEY,
    AgenteId BIGINT NULL,
    DataDoPreenchimento DATE NOT NULL,
    Pendencia INT NOT NULL,
    TipoDeInseticida NVARCHAR(255) NOT NULL,
    NumeroDeCarga INT NOT NULL,
    PesquisaId BIGINT NOT NULL,
    DataDeRegistro DATETIME NOT NULL,
    DataDeAtualizacao DATETIME NOT NULL,
    CriadoPor BIGINT NOT NULL,
    AtualizadoPor BIGINT NOT NULL,
    CONSTRAINT FK_Borrifacao_Pesquisa FOREIGN KEY (PesquisaId) REFERENCES Pesquisa(PesquisaId)
);
GO

CREATE TABLE Residencia (
    ResidenciaId BIGINT PRIMARY KEY IDENTITY(1,1),
    CodigoDaLocalidade BIGINT NOT NULL,
    TipoDoImovel INT NOT NULL,
    NomeDoMorador NVARCHAR(255),
    Numero INT,
    Complemento NVARCHAR(255),
    NumeroDoQuarteirao BIGINT,
    ComplementoDoQuarteirao NVARCHAR(255),
    Demolida INT NOT NULL,
    Inabitado INT NOT NULL,
    DataDeRegistro DATETIME NOT NULL,
    DataDeAtualizacao DATETIME NOT NULL,
    CriadoPor BIGINT NOT NULL,
    AtualizadoPor BIGINT NOT NULL
);
GO

CREATE PROCEDURE DeleteAgente
    @AgenteId BIGINT
AS
BEGIN
    DELETE FROM Agente WHERE AgenteId = @AgenteId;
END
GO

CREATE PROCEDURE DeleteResidence
    @ResidenciaId BIGINT
AS
BEGIN
    DELETE FROM Residencia WHERE ResidenciaId = @ResidenciaId;
END
GO

CREATE PROCEDURE GetAgenteByCPF
    @CPF NVARCHAR(14)
AS
BEGIN
    SELECT AgenteId as Id,
              NomeDoAgente,
              Turma,
              Senha,
              Matricula,
              CPF,
              Hierarquia,
              Tentativas,
              UltimaTentativa,
              DataDeRegistro,
              DataDeAtualizacao,
              CriadoPor,
              AtualizadoPor
     FROM Agente WHERE CPF = @CPF;
END
GO

CREATE PROCEDURE GetAgenteByMatricula
    @Matricula BIGINT
AS
BEGIN
    SELECT * FROM Agente WHERE Matricula = @Matricula;
END
GO

CREATE PROCEDURE GetAVWeeklyReport
    @DataInicial DATE,
    @DataFinal DATE,
    @Turma NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        r.CodigoDaLocalidade,
        l.Nome,
        l.Categoria,
        p.DataDaVisita AS Data,
        CAST(0 AS BIT) AS Conclusao,
        CASE WHEN SUM(CASE WHEN p.AnexosPositivos > 0 THEN 1 ELSE 0 END) > 0 THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END AS LocalidadePositiva,
        SUM(p.NumeroDeHabitantes) AS NumeroHabitantes,
        -- CasasTrabalhadas
        SUM(CASE WHEN p.AnexosPositivos > 0 THEN 1 ELSE 0 END) AS CasasTrabalhadasPositivas,
        SUM(CASE WHEN p.AnexosPositivos = 0 THEN 1 ELSE 0 END) AS CasasTrabalhadasNegativas,
        COUNT(p.PesquisaId) AS CasasTrabalhadasTotal,
        -- CasasPendentes
        SUM(CASE WHEN p.Pendencia = 2 THEN 1 ELSE 0 END) AS CasasPendentesFechadas,
        SUM(CASE WHEN p.Pendencia = 1 THEN 1 ELSE 0 END) AS CasasPendentesRecusadas,
        SUM(CASE WHEN p.Pendencia IN (1,2) THEN 1 ELSE 0 END) AS CasasPendentesTotal,
        -- AnexosTrabalhados
        SUM(p.AnexosPositivos) AS AnexosTrabalhadosPositivas,
        SUM(p.AnexosNegativos) AS AnexosTrabalhadosNegativas,
        SUM(p.AnexosPositivos + p.AnexosNegativos) AS AnexosTrabalhadosTotal,
        -- UnidadesDomiciliares (igual CasasTrabalhadas)
        SUM(CASE WHEN p.AnexosPositivos > 0 THEN 1 ELSE 0 END) AS UnidadesDomiciliaresPositivas,
        SUM(CASE WHEN p.AnexosPositivos = 0 THEN 1 ELSE 0 END) AS UnidadesDomiciliaresNegativas,
        COUNT(p.PesquisaId) AS UnidadesDomiciliaresTotal,
        -- TriatomineosCapturados
        SUM(CASE WHEN p.CapturaIntra = 1 THEN 1 ELSE 0 END) AS TriatomineosCapturadosIntra,
        SUM(CASE WHEN p.CapturaPeri = 1 THEN 1 ELSE 0 END) AS TriatomineosCapturadosPeri,
        SUM(CASE WHEN p.CapturaIntra = 1 THEN 1 ELSE 0 END) + SUM(CASE WHEN p.CapturaPeri = 1 THEN 1 ELSE 0 END) AS TriatomineosCapturadosTotal,
        -- HomensTrabalhando
        COUNT(DISTINCT p.CriadoPor) AS HomensTrabalhando,
        -- Caes e Gatos
        SUM(p.NumeroDeCachorros) AS Caes,
        SUM(p.NumeroDeGatos) AS Gatos
    FROM
        Pesquisa p
        LEFT JOIN PIT pit ON pit.PesquisaId = p.PesquisaId
        INNER JOIN Residencia r ON p.ResidenciaId = r.ResidenciaId
        INNER JOIN Localidade l ON r.CodigoDaLocalidade = l.CodigoDaLocalidade
    WHERE
        p.DataDeRegistro BETWEEN @DataInicial AND @DataFinal
        AND pit.PesquisaId IS NULL
        -- Filtro de turma, se existir campo na Pesquisa
        -- AND p.Turma = @Turma
    GROUP BY
        r.CodigoDaLocalidade,
        l.Nome,
        l.Categoria,
        p.DataDaVisita
END
GO

CREATE PROCEDURE GetLocalityByCode
    @CodigoDaLocalidade INT
AS
BEGIN
    SELECT LocalidadeId
      ,CodigoDaLocalidade
      ,Nome
      ,Categoria
      ,DataDeRegistro
      ,DataDeAtualizacao
      ,CriadoPor
      ,AtualizadoPor
    FROM Localidade
    WHERE @CodigoDaLocalidade = CodigoDaLocalidade;
END
GO

CREATE PROCEDURE GetLocalityList
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        LocalidadeId,
        CodigoDaLocalidade,
        Nome,
        Categoria,
        DataDeRegistro,
        DataDeAtualizacao,
        CriadoPor,
        AtualizadoPor
    FROM Localidade;
END
GO

CREATE PROCEDURE GetPendingPITByFilters
    @CodigoDaLocalidade BIGINT = NULL,
    @NomeDoMorador NVARCHAR(255) = NULL,
    @NumeroDaCasa INT = NULL,
    @NumeroDoComplemento NVARCHAR(255) = NULL,
    @Order INT = 0,
    @OrderType INT = 0,
    @Page INT = 1,
    @Year INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @PageSize INT = 10;
    DECLARE @Offset INT = (@Page - 1) * @PageSize;

    ;WITH PITPendentes AS (
        SELECT
            NULL AS Id,
            PIT.PitId AS PITId,
            PIT.CodigoDaLocalidade,
            NULL AS NomeDaLocalidade,
            NULL AS CategoriaDaLocalidade,
            PIT.NomeDoMorador,
            PIT.NumeroDaCasa AS Numero,
            NULL AS Complemento,
            PIT.DataDeRegistro,
            PIT.DataDeAtualizacao,
            PIT.CriadoPor,
            PIT.AtualizadoPor
        FROM PIT
        WHERE PIT.PesquisaId IS NULL
          AND (@CodigoDaLocalidade IS NULL OR PIT.CodigoDaLocalidade = @CodigoDaLocalidade)
          AND (@NomeDoMorador IS NULL OR PIT.NomeDoMorador LIKE '%' + @NomeDoMorador + '%')
          AND (@NumeroDaCasa IS NULL OR PIT.NumeroDaCasa = @NumeroDaCasa)
          AND (YEAR(PIT.DataDeRegistro) = @Year OR @Year IS NULL)
          AND NOT EXISTS (
              SELECT 1 FROM Residencia
              WHERE Residencia.CodigoDaLocalidade = PIT.CodigoDaLocalidade
                AND Residencia.Numero = PIT.NumeroDaCasa
          )

        UNION ALL

        SELECT
            R.ResidenciaId AS Id,
            PIT.PitId AS PITId,
            R.CodigoDaLocalidade,
            NULL AS NomeDaLocalidade,
            NULL AS CategoriaDaLocalidade,
            R.NomeDoMorador,
            R.Numero,
            R.Complemento,
            PIT.DataDeRegistro,
            PIT.DataDeAtualizacao,
            PIT.CriadoPor,
            PIT.AtualizadoPor
        FROM PIT
        INNER JOIN Residencia R
            ON R.CodigoDaLocalidade = PIT.CodigoDaLocalidade
            AND R.Numero = PIT.NumeroDaCasa
        WHERE PIT.PesquisaId IS NULL
          AND (@CodigoDaLocalidade IS NULL OR PIT.CodigoDaLocalidade = @CodigoDaLocalidade)
          AND (@NomeDoMorador IS NULL OR R.NomeDoMorador LIKE '%' + @NomeDoMorador + '%')
          AND (@NumeroDaCasa IS NULL OR R.Numero = @NumeroDaCasa)
          AND (YEAR(PIT.DataDeRegistro) = @Year OR @Year IS NULL)
    ),
    Total AS (
        SELECT COUNT(*) AS TotalCount FROM PITPendentes
    )
    SELECT 
        p.*,
        t.TotalCount,
        @PageSize AS PageSize,
        @Page AS PageNumber,
        CEILING(CAST(t.TotalCount AS FLOAT) / @PageSize) AS TotalPages
    FROM PITPendentes p
    CROSS JOIN Total t
    ORDER BY
        CASE WHEN @OrderType = 0 AND @Order = 0 THEN p.Complemento END ASC,
        CASE WHEN @OrderType = 0 AND @Order = 1 THEN p.Complemento END DESC,
        CASE WHEN @OrderType = 1 AND @Order = 0 THEN p.Numero END ASC,
        CASE WHEN @OrderType = 1 AND @Order = 1 THEN p.Numero END DESC,
        CASE WHEN @OrderType = 2 AND @Order = 0 THEN p.NomeDoMorador END ASC,
        CASE WHEN @OrderType = 2 AND @Order = 1 THEN p.NomeDoMorador END DESC
    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
END
GO

CREATE PROCEDURE GetPendingSearchByResidenciaId
    @ResidenciaId BIGINT,
    @Year INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM Pesquisa
        WHERE ResidenciaId = @ResidenciaId
          AND YEAR(DataDaVisita) = @Year
    )
    BEGIN
        SELECT 
            ResidenciaId AS Id,
            CodigoDaLocalidade,
            TipoDoImovel,
            Demolida,
            Numero,
            Complemento,
            NumeroDoQuarteirao,
            ComplementoDoQuarteirao,
            NomeDoMorador,
            Inabitado
        FROM Residencia
        WHERE ResidenciaId = @ResidenciaId
    END
END
GO

CREATE PROCEDURE GetPendingSearchListByFilters
    @CodigoDaLocalidade BIGINT,
    @NomeDoMorador NVARCHAR(255) = NULL,
    @NumeroDaCasa INT = NULL,
    @NumeroDoComplemento NVARCHAR(255) = NULL,
    @Order INT = 0,         -- 0: Asc, 1: Desc
    @OrderType INT = 0,     -- 0: Complemento, 1: Numero, 2: NomeDoMorador
    @Page INT = 1,
    @Year INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @PageSize INT = 10;
    DECLARE @Offset INT = (@Page - 1) * @PageSize;

    ;WITH ResidenciasPendentes AS (
        SELECT
            r.ResidenciaId AS Id,
            r.CodigoDaLocalidade,
            l.Nome AS NomeDaLocalidade,
            l.Categoria AS CategoriaDaLocalidade,
            r.NomeDoMorador,
            r.Numero,
            r.Complemento,
            r.DataDeRegistro,
            r.DataDeAtualizacao,
            r.CriadoPor,
            r.AtualizadoPor
        FROM Residencia r
        INNER JOIN Localidade l ON r.CodigoDaLocalidade = l.CodigoDaLocalidade
        WHERE r.CodigoDaLocalidade = @CodigoDaLocalidade
          AND (@NomeDoMorador IS NULL OR r.NomeDoMorador LIKE '%' + @NomeDoMorador + '%')
          AND (@NumeroDaCasa IS NULL OR r.Numero = @NumeroDaCasa)
          AND (@NumeroDoComplemento IS NULL OR r.Complemento = @NumeroDoComplemento)
          AND NOT EXISTS (
                SELECT 1
                FROM Pesquisa p
                WHERE p.ResidenciaId = r.ResidenciaId
                  AND YEAR(p.DataDaVisita) = @Year
            )
    ),
    Total AS (
        SELECT COUNT(*) AS TotalCount FROM ResidenciasPendentes
    )
    SELECT 
        rp.*,
        t.TotalCount,
        @PageSize AS PageSize,
        @Page AS PageNumber,
        CEILING(CAST(t.TotalCount AS FLOAT) / @PageSize) AS TotalPages
    FROM ResidenciasPendentes rp
    CROSS JOIN Total t
    ORDER BY
        CASE WHEN @OrderType = 0 AND @Order = 0 THEN rp.Complemento END ASC,
        CASE WHEN @OrderType = 0 AND @Order = 1 THEN rp.Complemento END DESC,
        CASE WHEN @OrderType = 1 AND @Order = 0 THEN rp.Numero END ASC,
        CASE WHEN @OrderType = 1 AND @Order = 1 THEN rp.Numero END DESC,
        CASE WHEN @OrderType = 2 AND @Order = 0 THEN rp.NomeDoMorador END ASC,
        CASE WHEN @OrderType = 2 AND @Order = 1 THEN rp.NomeDoMorador END DESC
    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
END
GO

CREATE PROCEDURE GetPendingSprayListByFilters
    @CodigoDaLocalidade BIGINT,
    @NomeDoMorador NVARCHAR(255) = NULL,
    @NumeroDaCasa INT = NULL,
    @NumeroDoComplemento NVARCHAR(255) = NULL,
    @Order INT = 0,
    @OrderType INT = 0,
    @Page INT = 1,
    @Year INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @PageSize INT = 10;
    DECLARE @Offset INT = (@Page - 1) * @PageSize;

    ;WITH Pendentes AS (
        SELECT
            r.ResidenciaId AS Id,
            p.PesquisaId,
            r.CodigoDaLocalidade,
            l.Nome AS NomeDaLocalidade,
            l.Categoria AS CategoriaDaLocalidade,
            r.NomeDoMorador,
            r.Numero,
            r.Complemento,
            r.DataDeRegistro,
            r.DataDeAtualizacao,
            r.CriadoPor,
            r.AtualizadoPor
        FROM Pesquisa p
        INNER JOIN Residencia r ON r.ResidenciaId = p.ResidenciaId
        INNER JOIN Localidade l ON l.CodigoDaLocalidade = r.CodigoDaLocalidade
        WHERE r.CodigoDaLocalidade = @CodigoDaLocalidade
          AND YEAR(p.DataDaVisita) = @Year
          AND (p.CapturaIntra = 1 OR p.CapturaPeri = 1)
          AND NOT EXISTS (
                SELECT 1 FROM Borrifacao b WHERE b.PesquisaId = p.PesquisaId
          )
          AND (@NomeDoMorador IS NULL OR r.NomeDoMorador LIKE '%' + @NomeDoMorador + '%')
          AND (@NumeroDaCasa IS NULL OR r.Numero = @NumeroDaCasa)
          AND (@NumeroDoComplemento IS NULL OR r.Complemento = @NumeroDoComplemento)
    ),
    Total AS (
        SELECT COUNT(*) AS TotalCount FROM Pendentes
    )
    SELECT 
        p.*,
        t.TotalCount,
        @PageSize AS PageSize,
        @Page AS PageNumber,
        CEILING(CAST(t.TotalCount AS FLOAT) / @PageSize) AS TotalPages
    FROM Pendentes p
    CROSS JOIN Total t
    ORDER BY
        CASE WHEN @OrderType = 0 AND @Order = 0 THEN p.Complemento END ASC,
        CASE WHEN @OrderType = 0 AND @Order = 1 THEN p.Complemento END DESC,
        CASE WHEN @OrderType = 1 AND @Order = 0 THEN p.Numero END ASC,
        CASE WHEN @OrderType = 1 AND @Order = 1 THEN p.Numero END DESC,
        CASE WHEN @OrderType = 2 AND @Order = 0 THEN p.NomeDoMorador END ASC,
        CASE WHEN @OrderType = 2 AND @Order = 1 THEN p.NomeDoMorador END DESC
    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
END
GO

CREATE PROCEDURE GetPITByFilters
    @CodigoDaLocalidade BIGINT = NULL,
    @NomeDoMorador NVARCHAR(255) = NULL,
    @NumeroDaCasa INT = NULL,
    @NumeroDoComplemento NVARCHAR(255) = NULL,
    @Order INT = 0,
    @OrderType INT = 0,
    @Page INT = 1,
    @Year INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @PageSize INT = 10;
    DECLARE @Offset INT = (@Page - 1) * @PageSize;

    ;WITH PITComPesquisa AS (
        SELECT
            R.ResidenciaId AS Id,
            PIT.PitId AS PITId,
            R.CodigoDaLocalidade,
            NULL AS NomeDaLocalidade,
            NULL AS CategoriaDaLocalidade,
            R.NomeDoMorador,
            R.Numero,
            R.Complemento,
            PIT.DataDeRegistro,
            PIT.DataDeAtualizacao,
            PIT.CriadoPor,
            PIT.AtualizadoPor
        FROM PIT
        INNER JOIN Residencia R
            ON R.CodigoDaLocalidade = PIT.CodigoDaLocalidade
            AND R.Numero = PIT.NumeroDaCasa
        WHERE PIT.PesquisaId IS NOT NULL
          AND (@CodigoDaLocalidade IS NULL OR PIT.CodigoDaLocalidade = @CodigoDaLocalidade)
          AND (@NomeDoMorador IS NULL OR R.NomeDoMorador LIKE '%' + @NomeDoMorador + '%')
          AND (@NumeroDaCasa IS NULL OR R.Numero = @NumeroDaCasa)
          AND (YEAR(PIT.DataDeRegistro) = @Year OR @Year IS NULL)
    ),
    Total AS (
        SELECT COUNT(*) AS TotalCount FROM PITComPesquisa
    )
    SELECT 
        p.*,
        t.TotalCount,
        @PageSize AS PageSize,
        @Page AS PageNumber,
        CEILING(CAST(t.TotalCount AS FLOAT) / @PageSize) AS TotalPages
    FROM PITComPesquisa p
    CROSS JOIN Total t
    ORDER BY
        CASE WHEN @OrderType = 0 AND @Order = 0 THEN p.Complemento END ASC,
        CASE WHEN @OrderType = 0 AND @Order = 1 THEN p.Complemento END DESC,
        CASE WHEN @OrderType = 1 AND @Order = 0 THEN p.Numero END ASC,
        CASE WHEN @OrderType = 1 AND @Order = 1 THEN p.Numero END DESC,
        CASE WHEN @OrderType = 2 AND @Order = 0 THEN p.NomeDoMorador END ASC,
        CASE WHEN @OrderType = 2 AND @Order = 1 THEN p.NomeDoMorador END DESC
    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
END
GO

CREATE PROCEDURE GetPITById
    @PITId BIGINT
AS
BEGIN

    SET NOCOUNT ON;

    SELECT 
        PitId,
        AgenteId,
        NumeracaoDoPit,
        Cres,
        Municipio,
        CodigoDaLocalidade,
        NumeroDaCasa,
        CapturaIntra,
        CapturaPeri,
        LocalOndeEntrou,
        NomeDoMorador,
        NomeDoCapturador,
        TipoDeInseto,
        OutroTipoDeInseto,
        NomeDoRecebedor,
        PesquisaId,
        DataDeRegistro,
        DataDeAtualizacao,
        CriadoPor,
        AtualizadoPor
    FROM PIT
    WHERE PitId = @PITId;
END;
GO

CREATE PROCEDURE GetPITWeeklyReport
    @DataInicial DATE,
    @DataFinal DATE,
    @Turma NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        r.CodigoDaLocalidade,
        l.Nome,
        l.Categoria,
        p.DataDaVisita AS Data,
        CAST(0 AS BIT) AS Conclusao,
        CASE WHEN SUM(CASE WHEN p.AnexosPositivos > 0 THEN 1 ELSE 0 END) > 0 THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END AS LocalidadePositiva,
        SUM(p.NumeroDeHabitantes) AS NumeroHabitantes,
        -- CasasTrabalhadas
        SUM(CASE WHEN p.AnexosPositivos > 0 THEN 1 ELSE 0 END) AS CasasTrabalhadasPositivas,
        SUM(CASE WHEN p.AnexosPositivos = 0 THEN 1 ELSE 0 END) AS CasasTrabalhadasNegativas,
        COUNT(p.PesquisaId) AS CasasTrabalhadasTotal,
        -- CasasPendentes
        SUM(CASE WHEN p.Pendencia = 2 THEN 1 ELSE 0 END) AS CasasPendentesFechadas,
        SUM(CASE WHEN p.Pendencia = 1 THEN 1 ELSE 0 END) AS CasasPendentesRecusadas,
        SUM(CASE WHEN p.Pendencia IN (1,2) THEN 1 ELSE 0 END) AS CasasPendentesTotal,
        -- AnexosTrabalhados
        SUM(p.AnexosPositivos) AS AnexosTrabalhadosPositivas,
        SUM(p.AnexosNegativos) AS AnexosTrabalhadosNegativas,
        SUM(p.AnexosPositivos + p.AnexosNegativos) AS AnexosTrabalhadosTotal,
        -- UnidadesDomiciliares (igual CasasTrabalhadas)
        SUM(CASE WHEN p.AnexosPositivos > 0 THEN 1 ELSE 0 END) AS UnidadesDomiciliaresPositivas,
        SUM(CASE WHEN p.AnexosPositivos = 0 THEN 1 ELSE 0 END) AS UnidadesDomiciliaresNegativas,
        COUNT(p.PesquisaId) AS UnidadesDomiciliaresTotal,
        -- TriatomineosCapturados
        SUM(CASE WHEN p.CapturaIntra = 1 THEN 1 ELSE 0 END) AS TriatomineosCapturadosIntra,
        SUM(CASE WHEN p.CapturaPeri = 1 THEN 1 ELSE 0 END) AS TriatomineosCapturadosPeri,
        SUM(CASE WHEN p.CapturaIntra = 1 THEN 1 ELSE 0 END) + SUM(CASE WHEN p.CapturaPeri = 1 THEN 1 ELSE 0 END) AS TriatomineosCapturadosTotal,
        -- HomensTrabalhando
        COUNT(DISTINCT p.CriadoPor) AS HomensTrabalhando,
        -- Caes e Gatos
        SUM(p.NumeroDeCachorros) AS Caes,
        SUM(p.NumeroDeGatos) AS Gatos
    FROM
        PIT pit
        INNER JOIN Pesquisa p ON pit.PesquisaId = p.PesquisaId
        INNER JOIN Residencia r ON p.ResidenciaId = r.ResidenciaId
        INNER JOIN Localidade l ON r.CodigoDaLocalidade = l.CodigoDaLocalidade
    WHERE
        p.DataDeRegistro BETWEEN @DataInicial AND @DataFinal
        -- Filtro de turma, se existir campo na PIT
        -- AND pit.Turma = @Turma
    GROUP BY
        r.CodigoDaLocalidade,
        l.Nome,
        l.Categoria,
        p.DataDaVisita
END
GO

ALTER PROCEDURE GetResidenceListByFilters
    @CodigoDaLocalidade BIGINT,
    @NomeDoMorador NVARCHAR(255) = NULL,
    @NumeroDaCasa INT = NULL,
    @NumeroDoComplemento NVARCHAR(255) = NULL,
    @Order INT = 0,        
    @OrderType INT = 0,     
    @Page INT = 1           
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @PageSize INT = 10;
    DECLARE @Offset INT = (@Page - 1) * @PageSize;

    WITH ResidenciasFiltradas AS (
        SELECT
            r.ResidenciaId AS Id,
            r.CodigoDaLocalidade,
            l.Nome AS NomeDaLocalidade,
            l.Categoria AS CategoriaDaLocalidade,
            CAST(r.TipoDoImovel AS NVARCHAR) AS TipoDeImovel,
            r.NomeDoMorador,
            r.Numero,
            r.Complemento,
            r.NumeroDoQuarteirao,
            r.ComplementoDoQuarteirao,
            CAST(r.Demolida AS BIT) AS Demolida,
            CAST(r.Inabitado AS BIT) AS Inabitado,
            r.DataDeRegistro,
            r.DataDeAtualizacao,
            r.CriadoPor,
            r.AtualizadoPor
        FROM Residencia r
        INNER JOIN Localidade l ON r.CodigoDaLocalidade = l.CodigoDaLocalidade
        WHERE r.CodigoDaLocalidade = @CodigoDaLocalidade
          AND (@NomeDoMorador IS NULL OR r.NomeDoMorador LIKE '%' + @NomeDoMorador + '%')
          AND (@NumeroDaCasa IS NULL OR r.Numero = @NumeroDaCasa)
          AND (@NumeroDoComplemento IS NULL OR r.Complemento = @NumeroDoComplemento)
    )
    , Total AS (
        SELECT COUNT(*) AS TotalCount FROM ResidenciasFiltradas
    )
    SELECT 
        rf.*,
        t.TotalCount,
        @PageSize AS PageSize,
        @Page AS PageNumber,
        CEILING(CAST(t.TotalCount AS FLOAT) / @PageSize) AS TotalPages
    FROM ResidenciasFiltradas rf
    CROSS JOIN Total t
    ORDER BY
        CASE WHEN @OrderType = 0 AND @Order = 0 THEN Complemento END ASC,
        CASE WHEN @OrderType = 0 AND @Order = 1 THEN Complemento END DESC,
        CASE WHEN @OrderType = 1 AND @Order = 0 THEN Numero END ASC,
        CASE WHEN @OrderType = 1 AND @Order = 1 THEN Numero END DESC,
        CASE WHEN @OrderType = 2 AND @Order = 0 THEN NomeDoMorador END ASC,
        CASE WHEN @OrderType = 2 AND @Order = 1 THEN NomeDoMorador END DESC
    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
END
GO

CREATE PROCEDURE GetResidenciaByLocalidadeAndNumeroAndComplemento
    @CodigoDaLocalidade BIGINT,
    @Numero INT,
    @Complemento NVARCHAR(255)
AS
BEGIN
    SELECT ResidenciaId AS Id,
           CodigoDaLocalidade,
           TipoDoImovel,
           NomeDoMorador,
           Numero,
           Complemento,
           NumeroDoQuarteirao,
           ComplementoDoQuarteirao,
           Demolida,
           Inabitado,
           DataDeRegistro,
           DataDeAtualizacao,
           CriadoPor,
           AtualizadoPor
    FROM Residencia 
    WHERE CodigoDaLocalidade = @CodigoDaLocalidade 
      AND (@Numero IS NULL OR Numero = @Numero )
      AND Complemento = @Complemento;
END
GO

CREATE PROCEDURE GetSearchWithPendingSprayById
    @PesquisaId BIGINT
AS
BEGIN
    SELECT P.PesquisaId  
    FROM Pesquisa AS P  
    LEFT JOIN Borrifacao AS B ON P.PesquisaId = B.PesquisaId  
    WHERE P.PesquisaId = @PesquisaId 
	AND B.PesquisaId IS NULL
    AND (P.CapturaIntra = 1 OR P.CapturaPeri = 1)
END;
GO

CREATE PROCEDURE InsertAgente
    @NomeDoAgente NVARCHAR(255),
    @Turma INT,
    @Senha NVARCHAR(255),
    @Matricula BIGINT,
    @CPF NVARCHAR(14),
    @Hierarquia INT,
    @Tentativas INT,
    @DataDeRegistro DATETIME,
    @DataDeAtualizacao DATETIME,
    @CriadoPor BIGINT,
    @AtualizadoPor BIGINT
AS
BEGIN
    INSERT INTO Agente (NomeDoAgente, Turma, Senha, Matricula, CPF, Hierarquia, Tentativas, DataDeRegistro, DataDeAtualizacao, CriadoPor, AtualizadoPor)
    VALUES (@NomeDoAgente, @Turma, @Senha, @Matricula, @CPF, @Hierarquia, @Tentativas, @DataDeRegistro, @DataDeAtualizacao, @CriadoPor, @AtualizadoPor);
END
GO

CREATE PROCEDURE InsertBorrifacao
    @AgenteId BIGINT,
    @DataDoPreenchimento DATE,
    @Pendencia INT,
    @TipoDeInseticida NVARCHAR(255),
    @NumeroDeCarga INT,
    @PesquisaId BIGINT,
    @DataDeRegistro DATETIME,
    @DataDeAtualizacao DATETIME,
    @CriadoPor BIGINT,
    @AtualizadoPor BIGINT
AS
BEGIN
    INSERT INTO Borrifacao (
        AgenteId,
        DataDoPreenchimento,
        Pendencia,
        TipoDeInseticida,
        NumeroDeCarga,
        PesquisaId,
        DataDeRegistro,
        DataDeAtualizacao,
        CriadoPor,
        AtualizadoPor
    )
    VALUES (
        @AgenteId,
        @DataDoPreenchimento,
        @Pendencia,
        @TipoDeInseticida,
        @NumeroDeCarga,
        @PesquisaId,
        @DataDeRegistro,
        @DataDeAtualizacao,
        @CriadoPor,
        @AtualizadoPor
    );
END;
GO

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
GO

CREATE PROCEDURE InsertPesquisa
    @ResidenciaId BIGINT,
    @AgenteId BIGINT,
    @DataDaVisita DATE,
    @Pendencia INT,
    @NomeDoMorador NVARCHAR(255),
    @NumeroDeHabitantes INT,
    @TipoDeParede INT,
    @OutraParede NVARCHAR(255) = NULL,
    @TipoDeTeto INT,
    @OutroTeto NVARCHAR(255) = NULL,
    @CapturaIntra BIT,
    @CapturaPeri BIT,
    @AnexosPositivos INT,
    @AnexosNegativos INT,
    @NumeroDeGatos INT,
    @NumeroDeCachorros INT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Pesquisa (
        ResidenciaId,
        DataDaVisita,
        Pendencia,
        NomeDoMorador,
        NumeroDeHabitantes,
        TipoDeParede,
        OutraParede,
        TipoDeTeto,
        OutroTeto,
        CapturaIntra,
        CapturaPeri,
        AnexosPositivos,
        AnexosNegativos,
        NumeroDeGatos,
        NumeroDeCachorros,
        DataDeRegistro,
        DataDeAtualizacao,
        CriadoPor,
        AtualizadoPor
    )
    OUTPUT INSERTED.PesquisaId
    VALUES (
        @ResidenciaId,
        @DataDaVisita,
        @Pendencia,
        @NomeDoMorador,
        @NumeroDeHabitantes,
        @TipoDeParede,
        @OutraParede,
        @TipoDeTeto,
        @OutroTeto,
        @CapturaIntra,
        @CapturaPeri,
        @AnexosPositivos,
        @AnexosNegativos,
        @NumeroDeGatos,
        @NumeroDeCachorros,
        GETDATE(),
        GETDATE(),
        @AgenteId,
        @AgenteId
    );
END
GO

CREATE PROCEDURE InsertPesquisaPIT
    @PITId BIGINT,
    @ResidenciaId BIGINT,
    @Data DATETIME,
    @Pendencia INT,
    @NomeDoMorador NVARCHAR(255),
    @NumeroDeHabitantes INT,
    @TipoDeParede INT,
    @OutroTipoDeParede NVARCHAR(255),
    @TipoDeTeto INT,
    @OutroTipoDeTeto NVARCHAR(255),
    @CapturaIntra BIT,
    @CapturaPeri BIT,
    @AnexosPositivos INT,
    @AnexosNegativos INT,
    @NumGatos INT,
    @NumCachorros INT,
    @AgenteId BIGINT,
    @DataDeRegistro DATETIME,
    @DataDeAtualizacao DATETIME
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Pesquisa (
        ResidenciaId,
        DataDaVisita,
        Pendencia,
        NomeDoMorador,
        NumeroDeHabitantes,
        TipoDeParede,
        OutraParede,
        TipoDeTeto,
        OutroTeto,
        CapturaIntra,
        CapturaPeri,
        AnexosPositivos,
        AnexosNegativos,
        NumeroDeGatos,
        NumeroDeCachorros,
        DataDeRegistro,
        DataDeAtualizacao,
        CriadoPor,
        AtualizadoPor
    ) 
    VALUES (
        @ResidenciaId,
        @Data,
        @Pendencia,
        @NomeDoMorador,
        @NumeroDeHabitantes,
        @TipoDeParede,
        @OutroTipoDeParede,
        @TipoDeTeto,
        @OutroTipoDeTeto,
        @CapturaIntra,
        @CapturaPeri,
        @AnexosPositivos,
        @AnexosNegativos,
        @NumGatos,
        @NumCachorros,
        @DataDeRegistro,
        @DataDeAtualizacao,
        @AgenteId,
        @AgenteId
    );

    UPDATE PIT
    SET PesquisaId = SCOPE_IDENTITY(),
        DataDeAtualizacao = @DataDeAtualizacao,
        AtualizadoPor = @AgenteId
    WHERE PitId = @PITId;
END;
GO

CREATE PROCEDURE InsertPIT
    @AgenteId BIGINT,
    @NumeracaoDoPit BIGINT,
    @Cres NVARCHAR(255),
    @Municipio NVARCHAR(255),
    @CodigoDaLocalidade BIGINT,
    @NumeroDaCasa INT,
    @CapturaIntra BIT,
    @CapturaPeri BIT,
    @LocalOndeEncontrou NVARCHAR(255),
    @NomeDoMorador NVARCHAR(255),
    @NomeDoCapturador NVARCHAR(255),
    @TipoDoInseto INT,
    @OutroTipoDeInseto NVARCHAR(255),
    @NomeDoRecebedor NVARCHAR(255),
    @PesquisaId BIGINT = NULL,
    @DataDeRegistro DATETIME,
    @DataDeAtualizacao DATETIME,
    @CriadoPor BIGINT,
    @AtualizadoPor BIGINT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO PIT (
        AgenteId,
        NumeracaoDoPit,
        Cres,
        Municipio,
        CodigoDaLocalidade,
        NumeroDaCasa,
        CapturaIntra,
        CapturaPeri,
        LocalOndeEntrou,
        NomeDoMorador,
        NomeDoCapturador,
        TipoDeInseto,
        OutroTipoDeInseto,
        NomeDoRecebedor,
        PesquisaId,
        DataDeRegistro,
        DataDeAtualizacao,
        CriadoPor,
        AtualizadoPor
    )
    VALUES (
        @AgenteId,
        @NumeracaoDoPit,
        @Cres,
        @Municipio,
        @CodigoDaLocalidade,
        @NumeroDaCasa,
        @CapturaIntra,
        @CapturaPeri,
        @LocalOndeEncontrou,
        @NomeDoMorador,
        @NomeDoCapturador,
        @TipoDoInseto,
        @OutroTipoDeInseto,
        @NomeDoRecebedor,
        @PesquisaId,
        @DataDeRegistro,
        @DataDeAtualizacao,
        @CriadoPor,
        @AtualizadoPor
    );
END
GO

CREATE PROCEDURE InsertResidencia
    @CodigoDaLocalidade BIGINT,
    @TipoDoImovel INT,
    @NomeDoMorador NVARCHAR(255),
    @Numero INT,
    @Complemento NVARCHAR(255),
    @NumeroDoQuarteirao BIGINT,
    @ComplementoDoQuarteirao NVARCHAR(255),
    @Demolida INT,
    @Inabitado INT,
    @DataDeRegistro DATETIME,
    @DataDeAtualizacao DATETIME,
    @CriadoPor BIGINT,
    @AtualizadoPor BIGINT
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Residencia (
        TipoDoImovel, NomeDoMorador, Numero, CodigoDaLocalidade, Complemento,
        NumeroDoQuarteirao, ComplementoDoQuarteirao, Demolida, Inabitado,
        DataDeRegistro, DataDeAtualizacao, CriadoPor, AtualizadoPor
    )
    OUTPUT INSERTED.ResidenciaId
    VALUES (
        @TipoDoImovel, @NomeDoMorador, @Numero, @CodigoDaLocalidade, @Complemento,
        @NumeroDoQuarteirao, @ComplementoDoQuarteirao, @Demolida, @Inabitado,
        @DataDeRegistro, @DataDeAtualizacao, @CriadoPor, @AtualizadoPor
    );
END
GO

CREATE PROCEDURE UpdateAgente
    @AgenteId BIGINT,
    @NomeDoAgente NVARCHAR(255),
    @Turma INT,
    @Senha NVARCHAR(255),
    @Matricula BIGINT,
    @CPF NVARCHAR(14),
    @Hierarquia INT,
    @DataDeRegistro DATETIME,
    @DataDeAtualizacao DATETIME,
    @CriadoPor BIGINT,
    @AtualizadoPor BIGINT
AS
BEGIN
    UPDATE Agente
    SET NomeDoAgente = @NomeDoAgente,
        Turma = @Turma,
        Senha = @Senha,
        Matricula = @Matricula,
        CPF = @CPF,
        Hierarquia = @Hierarquia,
        DataDeRegistro = @DataDeRegistro,
        DataDeAtualizacao = @DataDeAtualizacao,
        CriadoPor = @CriadoPor,
        AtualizadoPor = @AtualizadoPor
    WHERE AgenteId = @AgenteId;
END
GO

CREATE PROCEDURE UpdateAgenteTentativas
    @AgenteId BIGINT,
    @Tentativas INT
AS
BEGIN
    UPDATE Agente
    SET Tentativas = @Tentativas,
        UltimaTentativa = GETDATE()
    WHERE AgenteId = @AgenteId;
END
GO

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
GO

CREATE PROCEDURE UpdateResidence
    @ResidenciaId BIGINT,
    @TipoDoImovel INT,
    @NomeDoMorador NVARCHAR(255),
    @Numero INT,
    @CodigoDaLocalidade NVARCHAR(100),
    @Complemento NVARCHAR(255),
    @NumeroDoQuarteirao BIGINT,
    @ComplementoDoQuarteirao NVARCHAR(255),
    @SituacaoDoImovel INT,
    @DataDeRegistro DATETIME,
    @DataDeAtualizacao DATETIME,
    @CriadoPor BIGINT,
    @AtualizadoPor BIGINT
AS
BEGIN
    UPDATE Residencia
    SET TipoDoImovel = @TipoDoImovel,
        NomeDoMorador = @NomeDoMorador,
        Numero = @Numero,
        CodigoDaLocalidade = @CodigoDaLocalidade,
        Complemento = @Complemento,
        NumeroDoQuarteirao = @NumeroDoQuarteirao,
        ComplementoDoQuarteirao = @ComplementoDoQuarteirao,
        SituacaoDoImovel = @SituacaoDoImovel,
        DataDeRegistro = @DataDeRegistro,
        DataDeAtualizacao = @DataDeAtualizacao,
        CriadoPor = @CriadoPor,
        AtualizadoPor = @AtualizadoPor
    WHERE ResidenciaId = @ResidenciaId;
END
GO