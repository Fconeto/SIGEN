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
