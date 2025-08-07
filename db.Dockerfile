FROM mcr.microsoft.com/mssql/server:2022-latest

USER root
RUN apt-get update && \
    ACCEPT_EULA=Y apt-get install -y curl gnupg && \
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/ubuntu/22.04/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql18 mssql-tools18 unixodbc-dev && \
    echo 'export PATH="$PATH:/opt/mssql-tools18/bin"' >> ~/.bashrc

ENV PATH="$PATH:/opt/mssql-tools18/bin"
USER mssql