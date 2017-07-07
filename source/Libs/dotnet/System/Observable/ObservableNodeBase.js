/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
// Can be used as a base class, mixin, or simply reference on how to implement the pattern.
import ObservableBase from "./ObservableBase";
// noinspection JSUnusedLocalSymbols
export class ObservableNodeBase extends ObservableBase {
    onNext(value) {
        this._onNext(value);
    }
    onError(error) {
        this._onError(error);
    }
    onCompleted() {
        this._onCompleted();
    }
}
export default ObservableNodeBase;
//# sourceMappingURL=ObservableNodeBase.js.map