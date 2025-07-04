﻿// See https://aka.ms/new-console-template for more information

using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Find_Your_Home.Data;
using Find_Your_Home.Helpers.Extensions;
using Microsoft.OpenApi.Models;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Find_Your_Home.Exceptions;
using Swashbuckle.AspNetCore.Filters;
using Find_Your_Home.Helpers;
using Find_Your_Home.Hubs;
using Find_Your_Home.Models.Notifications;
using Find_Your_Home.Models.Users;
using Find_Your_Home.Repositories.AvailabilitySlotRepository;
using Find_Your_Home.Repositories.BookingRepository;
using Find_Your_Home.Repositories.ConversationRepository;
using Find_Your_Home.Repositories.FavoriteRepository;
using Find_Your_Home.Repositories.MessageRepository;
using Find_Your_Home.Repositories.NotificationsRepository;
using Find_Your_Home.Repositories.PropertyImgRepository;
using Find_Your_Home.Repositories.PropertyRepository;
using Find_Your_Home.Repositories.RentalRepository;
using Find_Your_Home.Repositories.ReviewRepository;
using Find_Your_Home.Repositories.UnitOfWork;
using Find_Your_Home.Repositories.UserRepository;
using Find_Your_Home.Services.AuthService;
using Find_Your_Home.Services.AvailabilitySlotService;
using Find_Your_Home.Services.BookingService;
using Find_Your_Home.Services.ConversationService;
using Find_Your_Home.Services.FavoriteService;
using Find_Your_Home.Services.Files;
using Find_Your_Home.Services.MessageService;
using Find_Your_Home.Services.NotificationsService;
using Find_Your_Home.Services.PropertyImagesService;
using Find_Your_Home.Services.PropertyService;
using Find_Your_Home.Services.RentalService;
using Find_Your_Home.Services.ReviewService;
using Find_Your_Home.Services.UserService;
using Find_Your_Home.Services.UserService;
using Microsoft.AspNetCore.Diagnostics;


var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();



// Add services to the container.

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));



builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new Find_Your_Home.Converters.TimeSpanConverter());
});


builder.Services.AddRepositories();
builder.Services.AddServices();

//add auto mapper
builder.Services.AddAutoMapper(typeof(MapperProfile));


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddScoped<IPropertyService, PropertyService>();
builder.Services.AddScoped<IPropertyRepository, PropertyRepository>();

builder.Services.AddScoped<IPropertyImgService, PropertyImgService>();
builder.Services.AddScoped<IPropertyImgRepository, PropertyImgRepository>();

builder.Services.AddScoped<IFavoriteRepository, FavoriteRepository>();
builder.Services.AddScoped<IFavoriteService, FavoriteService>();

builder.Services.AddScoped<IAvailabilitySlotRepository, AvailabilitySlotRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IAvailabilitySlotService, AvailabilitySlotService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddHostedService<BookingStatusUpdateService>();


builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddSingleton<ImageService>();
builder.Services.AddScoped<ImageHashService>();

builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<INotificationService, NotificationService>();

builder.Services.AddScoped<EmailService>(); 

builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));

builder.Services.AddScoped<IConversationRepository, ConversationRepository>();
builder.Services.AddScoped<IConversationService, ConversationService>();

builder.Services.AddScoped<IMessageRepository, MessageRepository>();
builder.Services.AddScoped<IMessageService, MessageService>();

builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<IReviewService, ReviewService>();

builder.Services.AddScoped<IRentalService, RentalService>();
builder.Services.AddScoped<IRentalRepository, RentalRepository>();
builder.Services.AddHostedService<PaymentReminderJob>();

builder.Services.AddScoped<FileService>();


builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey

    });
    options.OperationFilter<SecurityRequirementsOperationFilter>();
});

/*builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });

    options.OperationFilter<SecurityRequirementsOperationFilter>();
});*/

builder.Services.AddAuthentication().AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        ValidateAudience = false,
        ValidateIssuer = false,
        RoleClaimType = ClaimTypes.Role ,
        NameClaimType = ClaimTypes.Email,
        ClockSkew = TimeSpan.Zero,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                builder.Configuration.GetSection("AppSettings:Token").Value!))
    };
});

builder.Services.AddAuthorization();
builder.Services.AddSignalR();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder =>
        {
            builder.WithOrigins(
                    "https://find-your-home-final-project.vercel.app",
                    "https://find-your-home-final-pro-git-main-yourname-projects.vercel.app", 
                    "http://localhost:5173",
                    "http://localhost:4173"
                )
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});





var app = builder.Build();


/*
app.UseExceptionHandler(config =>
{
    config.Run(async context =>
    {
        var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;

        context.Response.ContentType = "application/json";

        if (exception is AppException appEx)
        {
            context.Response.StatusCode = 400;
            await context.Response.WriteAsJsonAsync(new
            {
                errorCode = appEx.ErrorCode,
                message = appEx.Message
            });
        }
        else
        {
            context.Response.StatusCode = 500;
            await context.Response.WriteAsJsonAsync(new
            {
                errorCode = "INTERNAL_SERVER_ERROR",
                message = exception?.Message ?? "A apărut o eroare necunoscută.",
                // Pentru debugging local, poți include stack-ul:
                stackTrace = exception?.StackTrace
            });
        }
    });
});*/


//app.UseCors("AllowAll");
app.UseCors("AllowFrontend");
//app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());


// Configure the HTTP request pipeline.

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Find Your Home API v1");
    options.RoutePrefix = "swagger";
});

app.MapHub<NotificationHub>("/notificationHub");
app.MapHub<ChatHub>("/chatHub");

app.UseMiddleware<GlobalExceptionHandlerMiddleware>();

//app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
