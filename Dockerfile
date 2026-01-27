FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY TeamTasksSample/TeamTasksSample.csproj TeamTasksSample/
COPY infrastructure/infrastructure/infrastructure.csproj infrastructure/infrastructure/
COPY CoreLibrary/CoreLibrary.csproj CoreLibrary/
COPY domain/Domain.csproj domain/

RUN dotnet restore TeamTasksSample/TeamTasksSample.csproj

COPY . .
RUN dotnet publish TeamTasksSample/TeamTasksSample.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
EXPOSE 80
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "TeamTasksSample.dll"]
