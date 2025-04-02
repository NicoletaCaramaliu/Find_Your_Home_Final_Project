using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Find_Your_Home.Migrations
{
    /// <inheritdoc />
    public partial class AddPropertyInformations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ForRent",
                table: "Properties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Furnished",
                table: "Properties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasGarden",
                table: "Properties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "NumberOfBalconies",
                table: "Properties",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "NumberOfKitchen",
                table: "Properties",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Views",
                table: "Properties",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "YearOfConstruction",
                table: "Properties",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ForRent",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Furnished",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "HasGarden",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "NumberOfBalconies",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "NumberOfKitchen",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Views",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "YearOfConstruction",
                table: "Properties");
        }
    }
}
