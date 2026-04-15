export function blocStateTemplate(name: string, pascal: string): string {
  return `part of '${name}_bloc.dart';

@freezed
sealed class ${pascal}State with _\$${pascal}State {
  const factory ${pascal}State({
    @Default(false) bool fakeVar,
  }) = _${pascal}State;

  const ${pascal}State._();

  factory ${pascal}State.initial() => const ${pascal}State();
}
`;
}
