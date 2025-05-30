using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Find_Your_Home.Migrations
{
    /// <inheritdoc />
    public partial class AddRentalInfo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RentalInfo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RentalId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RentPaymentDay = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ElectricityPaymentDay = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    WaterPaymentDay = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GasPaymentDay = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    InternetPaymentDay = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LandlordPhone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PlumberPhone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ElectricianPhone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GasServicePhone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    InternetProviderPhone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EmergencyContact = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContractSigned = table.Column<bool>(type: "bit", nullable: false),
                    ContractStartDate = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContractEndDate = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RentAmount = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RentalInfo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RentalInfo_Rentals_RentalId",
                        column: x => x.RentalId,
                        principalTable: "Rentals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RentalInfo_RentalId",
                table: "RentalInfo",
                column: "RentalId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RentalInfo");
        }
    }
}
