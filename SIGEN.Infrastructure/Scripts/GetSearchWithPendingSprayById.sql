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