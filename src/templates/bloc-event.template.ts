export function blocEventTemplate(name: string, pascal: string): string {
  return `part of '${name}_bloc.dart';

@freezed
sealed class ${pascal}Event with _\$${pascal}Event {
  const factory ${pascal}Event.started() = _Started;
}
`;
}
