FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-dotnet
WORKDIR /src

COPY ["./PrincipleStudios.PlanningPoker.sln", "./"]
COPY ["./PrincipleStudios.PlanningPoker/PrincipleStudios.PlanningPoker.csproj", "./PrincipleStudios.PlanningPoker/"]
COPY ["./PrincipleStudios.PlanningPoker.Tests/PrincipleStudios.PlanningPoker.Tests.csproj", "./PrincipleStudios.PlanningPoker.Tests/"]
RUN dotnet restore

# COPY ./schemas/ ./schemas/
COPY ./PrincipleStudios.PlanningPoker/ ./PrincipleStudios.PlanningPoker/
COPY ./PrincipleStudios.PlanningPoker.Tests/ ./PrincipleStudios.PlanningPoker.Tests/
COPY ./Directory.Build.props .
WORKDIR "/src/PrincipleStudios.PlanningPoker.Tests"
RUN dotnet build -p:SkipUiBuild=true
RUN dotnet test --no-build
WORKDIR "/src/PrincipleStudios.PlanningPoker"
RUN dotnet build "PrincipleStudios.PlanningPoker.csproj" -c Release -o /app/build

FROM node:16 AS build-ui
WORKDIR /src
# RUN wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb \
#   && dpkg -i packages-microsoft-prod.deb \
#   && rm packages-microsoft-prod.deb \
#   && apt-get update \
#   && apt-get install -y dotnet-runtime-6.0 \
#   && apt-get clean

COPY ["./PrincipleStudios.PlanningPoker.FrontEnd/package.json", "./PrincipleStudios.PlanningPoker.FrontEnd/"]
COPY ["./PrincipleStudios.PlanningPoker.FrontEnd/package-lock.json", "./PrincipleStudios.PlanningPoker.FrontEnd/"]
RUN cd ./PrincipleStudios.PlanningPoker.FrontEnd/ && npm ci

# COPY ./schemas/ ./schemas/
COPY ./PrincipleStudios.PlanningPoker.FrontEnd/ ./PrincipleStudios.PlanningPoker.FrontEnd/

WORKDIR "/src/PrincipleStudios.PlanningPoker.FrontEnd"
# RUN npm run generate-openapi

RUN npm run typecheck
# RUN CI=true npm test -- --passWithNoTests
RUN npm run lint -- --max-warnings 0
RUN npm run build

WORKDIR /src/PrincipleStudios.PlanningPoker.FrontEnd/out
RUN gzip -k -r *

FROM build-dotnet AS publish-dotnet
RUN dotnet publish "PrincipleStudios.PlanningPoker.csproj" -c Release -o /app/publish -p:SkipUiBuild=true

FROM base AS final

WORKDIR /app
ARG GITHASH
ENV BUILD__GITHASH=${GITHASH}
COPY --from=publish-dotnet /app/publish .
COPY --from=build-ui /src/PrincipleStudios.PlanningPoker.FrontEnd/out ./wwwroot
ENTRYPOINT ["dotnet", "PrincipleStudios.PlanningPoker.dll"]
