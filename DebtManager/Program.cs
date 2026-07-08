using DebtManager.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddControllers().AddJsonOptions(options =>{
                                                    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
                                                });
builder.Services.AddDbContext<AppDbContext>(options => 
                                                options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
                                            );
builder.Services.AddSwaggerGen();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddCors(options =>{
                                        options.AddPolicy("ReactApp", policy =>
                                        {
                                            policy.WithOrigins("http://localhost")
                                                .AllowAnyMethod()
                                                .AllowAnyHeader();
                                        });
                                    });

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
}

// app.Urls.Add("http://localhost:8080");
app.UseHttpsRedirection();
app.UseCors("ReactApp");
app.MapControllers();
app.Run();