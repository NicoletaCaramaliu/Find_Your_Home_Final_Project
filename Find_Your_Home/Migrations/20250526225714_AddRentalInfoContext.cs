using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Find_Your_Home.Migrations
{
    /// <inheritdoc />
    public partial class AddRentalInfoContext : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RentalInfo_Rentals_RentalId",
                table: "RentalInfo");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RentalInfo",
                table: "RentalInfo");

            migrationBuilder.RenameTable(
                name: "RentalInfo",
                newName: "RentalInfos");

            migrationBuilder.RenameIndex(
                name: "IX_RentalInfo_RentalId",
                table: "RentalInfos",
                newName: "IX_RentalInfos_RentalId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RentalInfos",
                table: "RentalInfos",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RentalInfos_Rentals_RentalId",
                table: "RentalInfos",
                column: "RentalId",
                principalTable: "Rentals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RentalInfos_Rentals_RentalId",
                table: "RentalInfos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RentalInfos",
                table: "RentalInfos");

            migrationBuilder.RenameTable(
                name: "RentalInfos",
                newName: "RentalInfo");

            migrationBuilder.RenameIndex(
                name: "IX_RentalInfos_RentalId",
                table: "RentalInfo",
                newName: "IX_RentalInfo_RentalId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RentalInfo",
                table: "RentalInfo",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RentalInfo_Rentals_RentalId",
                table: "RentalInfo",
                column: "RentalId",
                principalTable: "Rentals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
