using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Find_Your_Home.Migrations
{
    /// <inheritdoc />
    public partial class AddFavoriteTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Properties_Users_OwnerId",
                table: "Properties");

            migrationBuilder.CreateTable(
                name: "Favorites",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PropertyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Favorites", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Favorites_Properties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "Properties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Favorites_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Favorites_PropertyId",
                table: "Favorites",
                column: "PropertyId");

            migrationBuilder.CreateIndex(
                name: "IX_Favorites_UserId_PropertyId",
                table: "Favorites",
                columns: new[] { "UserId", "PropertyId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Properties_Users_OwnerId",
                table: "Properties",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Properties_Users_OwnerId",
                table: "Properties");

            migrationBuilder.DropTable(
                name: "Favorites");

            migrationBuilder.AddForeignKey(
                name: "FK_Properties_Users_OwnerId",
                table: "Properties",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
