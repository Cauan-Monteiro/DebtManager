FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:5017

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["DebtManager.csproj", "./"]
RUN dotnet restore "DebtManager.csproj"

COPY . .
RUN dotnet build "DebtManager.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "DebtManager.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# O banco SQLite fica isolado em /app/data, separado dos binários da aplicação,
# para que montar um volume aqui nunca "esconda" atualizações da imagem.
RUN mkdir -p /app/data
VOLUME ["/app/data"]
ENV ConnectionStrings__DefaultConnection="Data Source=/app/data/debtmanager.db"

ENTRYPOINT ["dotnet", "DebtManager.dll"]
