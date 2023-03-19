#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY Backend.csproj Backend.csproj
RUN dotnet restore Backend.csproj
COPY . .
WORKDIR /src
RUN dotnet build Backend.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish Backend.csproj -c Release -o /app /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
CMD ["dotnet", "Backend.dll"]