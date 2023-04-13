using Backend.DbModels;
using Backend.Utilities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog.Events;
using Serilog;
using Swashbuckle.AspNetCore.Filters;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configure config file
builder.Configuration.AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "Settings", "appsettings.json"));

// Logger
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .CreateBootstrapLogger();

// Add logger
builder.Host.UseSerilog();

// Configure Swagger
builder.Services.AddSwaggerGen(options => 
{

    options.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Ip Deputy Bot API",
        Description = "API for telegram bot Ip Deputy Bot",
        Contact = new OpenApiContact
        {
            Name = "Github",
            Url = new Uri("https://github.com/Navatusein/Ip-Deputy-2.0")
        },
        License = new OpenApiLicense
        {
            Name = "License",
            Url = new Uri("https://github.com/Navatusein/Ip-Deputy-2.0/blob/main/LICENSE")
        }
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Name = JwtBearerDefaults.AuthenticationScheme,
                In = ParameterLocation.Header,
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id=JwtBearerDefaults.AuthenticationScheme
                }
            },
            new string[]{}
        }
    });
});

// Configure Database
builder.Services.AddDbContextPool<IpDeputyDbContext>(options =>
{
    options.UseLazyLoadingProxies();

    switch (builder.Configuration["Database:Provider"])
    {
        case "Sqlite":
            options.UseSqlite(builder.Configuration["Database:ConnectionString"]);
            break;
        case "Npgsql":
            options.UseNpgsql(builder.Configuration["Database:ConnectionString"]);
            break;
        default:
            break;
    }
});

// Configure Frontend Authentication Service
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options => {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["FrontendAuthorizeJWT:Issuer"],
                        ValidAudience = builder.Configuration["FrontendAuthorizeJWT:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["FrontendAuthorizeJWT:Key"]))
                    };
                });

// Configure Bot Authentication Service
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddScheme<BotAuthenticationSchemeOptions, BotAuthenticationHandler>(
        BotAuthenticationSchemeOptions.DefaultScemeName,
        options =>
        {
            options.BotToken = builder.Configuration["BotAuthorizeToken"];
        }
    );

builder.Services.AddAutoMapper(typeof(AppMappingProfile));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(options => {
    string[] origins = builder.Configuration.GetSection("Origins").Get<string[]>();

    options.WithOrigins(origins);
    options.AllowAnyMethod();
    options.AllowAnyHeader();
    options.AllowCredentials();
});


app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Logger.LogInformation("Version: 1.0.2");

app.Run();
