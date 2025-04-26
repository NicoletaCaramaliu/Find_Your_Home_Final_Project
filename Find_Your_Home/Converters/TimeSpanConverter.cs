using System.Text.Json;
using System.Text.Json.Serialization;

namespace Find_Your_Home.Converters
{
    public class TimeSpanConverter : JsonConverter<TimeSpan>
    {
        public override TimeSpan Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var stringValue = reader.GetString();
            if (TimeSpan.TryParse(stringValue, out var parsed))
            {
                return parsed;
            }

            throw new JsonException($"Unable to parse TimeSpan from value: {stringValue}");
        }

        public override void Write(Utf8JsonWriter writer, TimeSpan value, JsonSerializerOptions options)
        {
            // Format standard ISO: "hh:mm:ss"
            writer.WriteStringValue(value.ToString(@"hh\:mm\:ss"));
        }
    }
}