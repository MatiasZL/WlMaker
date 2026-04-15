export function blocTemplate(name: string, pascal: string): string {
  return `import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

part '${name}_bloc.freezed.dart';
part '${name}_event.dart';
part '${name}_state.dart';

class ${pascal}Bloc extends Bloc<${pascal}Event, ${pascal}State> {
  ${pascal}Bloc() : super(${pascal}State.initial()) {
    on<_Started>(_startedEvent);
  }

  void _startedEvent(_Started event, Emitter<${pascal}State> emit) {
    // TODO: implement event
  }
}
`;
}
