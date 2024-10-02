---
title: AspNet EF migration
date: '2022-10-12'
tags: ['AspNet']
draft: false
summary:
---

When we develop a web application with AspNet, we do not need to initialize our database with sql command.

We can write code first and use migration command to generate a migration script provided by AspNet EF.

1. Write code (entity, configuration)
    ```csharp
    // entity file
    namespace WebApp.Domain.Entities;

    public class FooBar
    {
      public int Id { get; set; }
      public string name { get; set; }
    }

    // configuration file
    using WebApp.Domain.Entities;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Metadata.Builders;

    namespace WebApp.Infrastructure.Persistence.Configurations

    public class FooBarConfiguration : IEntityTypeConfiguration<FooBar>
    {
      public void Configure(EntityTypeBuilder<FooBar> builder)
      {
        builder.HasKey(p => p.Id);
      }
    }
    ```
2. Generate migration
    ```cmd
    dotnet ef migrations add [CustomizedMigrationName]
    ```
3. Apply migration to database
    ```cmd
    dotnet ef database update
    ```