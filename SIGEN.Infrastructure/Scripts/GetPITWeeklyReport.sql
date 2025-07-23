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