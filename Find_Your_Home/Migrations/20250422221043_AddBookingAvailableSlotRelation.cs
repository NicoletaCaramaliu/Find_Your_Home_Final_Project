using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Find_Your_Home.Migrations
{
    /// <inheritdoc />
    public partial class AddBookingAvailableSlotRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AvailabilitySlotId",
                table: "Bookings",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_AvailabilitySlotId",
                table: "Bookings",
                column: "AvailabilitySlotId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_AvailabilitySlots_AvailabilitySlotId",
                table: "Bookings",
                column: "AvailabilitySlotId",
                principalTable: "AvailabilitySlots",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_AvailabilitySlots_AvailabilitySlotId",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_AvailabilitySlotId",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "AvailabilitySlotId",
                table: "Bookings");
        }
    }
}
