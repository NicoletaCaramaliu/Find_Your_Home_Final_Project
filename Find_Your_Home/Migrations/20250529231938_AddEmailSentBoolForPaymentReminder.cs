using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Find_Your_Home.Migrations
{
    /// <inheritdoc />
    public partial class AddEmailSentBoolForPaymentReminder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ElectricityPaymentReminderSent",
                table: "RentalInfos",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "GasPaymentReminderSent",
                table: "RentalInfos",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "InternetPaymentReminderSent",
                table: "RentalInfos",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "RentPaymentReminderSent",
                table: "RentalInfos",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "WaterPaymentReminderSent",
                table: "RentalInfos",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ElectricityPaymentReminderSent",
                table: "RentalInfos");

            migrationBuilder.DropColumn(
                name: "GasPaymentReminderSent",
                table: "RentalInfos");

            migrationBuilder.DropColumn(
                name: "InternetPaymentReminderSent",
                table: "RentalInfos");

            migrationBuilder.DropColumn(
                name: "RentPaymentReminderSent",
                table: "RentalInfos");

            migrationBuilder.DropColumn(
                name: "WaterPaymentReminderSent",
                table: "RentalInfos");
        }
    }
}
