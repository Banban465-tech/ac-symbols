"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Il2Cpp;
(function (Il2Cpp) {
    /** */
    Il2Cpp.application = {
        /**
         * Gets the data path name of the current application, e.g.
         * `/data/emulated/0/Android/data/com.example.application/files`
         * on Android.
         *
         * **This information is not guaranteed to exist.**
         *
         * ```ts
         * Il2Cpp.perform(() => {
         *     // prints /data/emulated/0/Android/data/com.example.application/files
         *     console.log(Il2Cpp.application.dataPath);
         * });
         * ```
         */
        get dataPath() {
            return unityEngineCall("get_persistentDataPath");
        },
        /**
         * Gets the identifier name of the current application, e.g.
         * `com.example.application` on Android.
         *
         * In case the identifier cannot be retrieved, the main module name is
         * returned instead, which typically is the process name.
         *
         * ```ts
         * Il2Cpp.perform(() => {
         *     // prints com.example.application
         *     console.log(Il2Cpp.application.identifier);
         * });
         * ```
         */
        get identifier() {
            return unityEngineCall("get_identifier") ?? unityEngineCall("get_bundleIdentifier") ?? Process.mainModule.name;
        },
        /**
         * Gets the version name of the current application, e.g. `4.12.8`.
         *
         * In case the version cannot be retrieved, an hash of the IL2CPP
         * module is returned instead.
         *
         * ```ts
         * Il2Cpp.perform(() => {
         *     // prints 4.12.8
         *     console.log(Il2Cpp.application.version);
         * });
         * ```
         */
        get version() {
            return unityEngineCall("get_version") ?? exportsHash(Il2Cpp.module).toString(16);
        }
    };
    // prettier-ignore
    getter(Il2Cpp, "unityVersion", () => {
        try {
            const unityVersion = Il2Cpp.$config.unityVersion ?? unityEngineCall("get_unityVersion");
            if (unityVersion != null) {
                return unityVersion;
            }
        }
        catch (_) {
        }
        const searchPattern = "69 6c 32 63 70 70";
        for (const range of Il2Cpp.module.enumerateRanges("r--").concat(Process.getRangeByAddress(Il2Cpp.module.base))) {
            for (let { address } of Memory.scanSync(range.base, range.size, searchPattern)) {
                while (address.readU8() != 0) {
                    address = address.sub(1);
                }
                const match = UnityVersion.find(address.add(1).readCString());
                if (match != undefined) {
                    return match;
                }
            }
        }
        raise("couldn't determine the Unity version, please specify it manually");
    }, lazy);
    // prettier-ignore
    getter(Il2Cpp, "unityVersionIsBelow201830", () => {
        return UnityVersion.lt(Il2Cpp.unityVersion, "2018.3.0");
    }, lazy);
    // prettier-ignore
    getter(Il2Cpp, "unityVersionIsBelow202120", () => {
        return UnityVersion.lt(Il2Cpp.unityVersion, "2021.2.0");
    }, lazy);
    function unityEngineCall(method) {
        const handle = Il2Cpp.exports.resolveInternalCall(Memory.allocUtf8String("UnityEngine.Application::" + method));
        const nativeFunction = new NativeFunction(handle, "pointer", []);
        return nativeFunction.isNull() ? null : new Il2Cpp.String(nativeFunction()).asNullable()?.content ?? null;
    }
})(Il2Cpp || (Il2Cpp = {}));
var Il2Cpp;
(function (Il2Cpp) {
    /** Create a boxed primitive */
    function boxed(value, type) {
        const mapping = {
            int8: "System.SByte",
            uint8: "System.Byte",
            int16: "System.Int16",
            uint16: "System.UInt16",
            int32: "System.Int32",
            uint32: "System.UInt32",
            int64: "System.Int64",
            uint64: "System.UInt64",
            char: "System.Char",
            intptr: "System.IntPtr",
            uintptr: "System.UIntPtr"
        };
        const className = typeof value == "boolean"
            ? "System.Boolean"
            : typeof value == "number"
                ? mapping[type ?? "int32"]
                : value instanceof Int64
                    ? "System.Int64"
                    : value instanceof UInt64
                        ? "System.UInt64"
                        : value instanceof NativePointer
                            ? mapping[type ?? "intptr"]
                            : raise(`Cannot create boxed primitive using value of type '${typeof value}'`);
        const object = Il2Cpp.corlib.class(className ?? raise(`Unknown primitive type name '${type}'`)).alloc();
        (object.tryField("m_value") ?? object.tryField("_pointer") ?? raise(`Could not find primitive field in class '${className}'`)).value = value;
        return object;
    }
    Il2Cpp.boxed = boxed;
})(Il2Cpp || (Il2Cpp = {}));
var Il2Cpp;
(function (Il2Cpp) {
    /**
     * Set of configurations users can override. It is for advanced use cases,
     * when certain values cannot be detected automatically. \
     * For reference, see:
     * - {@link Il2Cpp.module};
     * - {@link Il2Cpp.unityVersion};
     * - {@link Il2Cpp.exports};
     */
    Il2Cpp.$config = {
        moduleName: undefined,
        unityVersion: undefined,
        exports: undefined
    };
})(Il2Cpp || (Il2Cpp = {}));
var Il2Cpp;
(function (Il2Cpp) {
    /**
     * @deprecated
     * Dumps the application, i.e. it creates a dummy `.cs` file that contains
     * all the class, field and method declarations.
     *
     * The dump is very useful when it comes to inspecting the application as
     * you can easily search for succulent members using a simple text search,
     * hence this is typically the very first thing it should be done when
     * working with a new application. \
     * Keep in mind the dump is version, platform and arch dependentend, so
     * it has to be re-genereated if any of these changes.
     *
     * The file is generated in the **target** device, so you might need to
     * pull it to the host device afterwards.
     *
     * Dumping *may* require a file name and a directory path (a place where the
     * application can write to). If not provided, the target path is generated
     * automatically using the information from {@link Il2Cpp.application}.
     *
     * ```ts
     * Il2Cpp.perform(() => {
     *     Il2Cpp.dump();
     * });
     * ```
     *
     * For instance, the dump resembles the following:
     * ```
     * class Mono.DataConverter.PackContext : System.Object
     * {
     *     System.Byte[] buffer; // 0x10
     *     System.Int32 next; // 0x18
     *     System.String description; // 0x20
     *     System.Int32 i; // 0x28
     *     Mono.DataConverter conv; // 0x30
     *     System.Int32 repeat; // 0x38
     *     System.Int32 align; // 0x3c
     *
     *     System.Void Add(System.Byte[] group); // 0x012ef4f0
     *     System.Byte[] Get(); // 0x012ef6ec
     *     System.Void .ctor(); // 0x012ef78c
     *   }
     * ```
     */
    function dump(fileName, path) {
        fileName = fileName ?? `${Il2Cpp.application.identifier}_${Il2Cpp.application.version}.cs`;
        path = path ?? Il2Cpp.application.dataPath ?? Process.getCurrentDir();
        createDirectoryRecursively(path);
        const destination = `${path}/${fileName}`;
        const file = new File(destination, "w");
        for (const assembly of Il2Cpp.domain.assemblies) {
            inform(`dumping ${assembly.name}...`);
            for (const klass of assembly.image.classes) {
                file.write(`${klass}\n\n`);
            }
        }
        file.flush();
        file.close();
        ok(`dump saved to ${destination}`);
        showDeprecationNotice();
    }
    Il2Cpp.dump = dump;
    /**
     * @deprecated
     * Just like {@link Il2Cpp.dump}, but a `.cs` file per assembly is
     * generated instead of having a single big `.cs` file. For instance, all
     * classes within `System.Core` and `System.Runtime.CompilerServices.Unsafe`
     * are dumped into `System/Core.cs` and
     * `System/Runtime/CompilerServices/Unsafe.cs`, respectively.
     *
     * ```ts
     * Il2Cpp.perform(() => {
     *     Il2Cpp.dumpTree();
     * });
     * ```
     */
    function dumpTree(path, ignoreAlreadyExistingDirectory = false) {
        path = path ?? `${Il2Cpp.application.dataPath ?? Process.getCurrentDir()}/${Il2Cpp.application.identifier}_${Il2Cpp.application.version}`;
        if (!ignoreAlreadyExistingDirectory && directoryExists(path)) {
            raise(`directory ${path} already exists - pass ignoreAlreadyExistingDirectory = true to skip this check`);
        }
        for (const assembly of Il2Cpp.domain.assemblies) {
            inform(`dumping ${assembly.name}...`);
            const destination = `${path}/${assembly.name.replaceAll(".", "/")}.cs`;
            createDirectoryRecursively(destination.substring(0, destination.lastIndexOf("/")));
            const file = new File(destination, "w");
            for (const klass of assembly.image.classes) {
                file.write(`${klass}\n\n`);
            }
            file.flush();
            file.close();
        }
        ok(`dump saved to ${path}`);
        showDeprecationNotice();
    }
    Il2Cpp.dumpTree = dumpTree;
    function directoryExists(path) {
        return Il2Cpp.corlib.class("System.IO.Directory").method("Exists").invoke(Il2Cpp.string(path));
    }
    function createDirectoryRecursively(path) {
        Il2Cpp.corlib.class("System.IO.Directory").method("CreateDirectory").invoke(Il2Cpp.string(path));
    }
    function showDeprecationNotice() {
        warn("this api will be removed in a future release, please use `npx frida-il2cpp-bridge dump` instead");
    }
})(Il2Cpp || (Il2Cpp = {}));
var Il2Cpp;
(function (Il2Cpp) {
    /**
     * Installs a listener to track any thrown (unrecoverable) C# exception. \
     * This may be useful when incurring in `abort was called` errors.
     *
     * By default, it only tracks exceptions that were thrown by the *caller*
     * thread.
     *
     * **It may not work for every platform.**
     *
     * ```ts
     * Il2Cpp.perform(() => {
     *     Il2Cpp.installExceptionListener("all");
     *
     *     // rest of the code
     * });
     * ```
     *
     * For instance, it may print something along:
     * ```
     * System.NullReferenceException: Object reference not set to an instance of an object.
     *   at AddressableLoadWrapper+<LoadGameObject>d__3[T].MoveNext () [0x00000] in <00000000000000000000000000000000>:0
     *   at UnityEngine.SetupCoroutine.InvokeMoveNext (System.Collections.IEnumerator enumerator, System.IntPtr returnValueAddress) [0x00000] in <00000000000000000000000000000000>:0
     * ```
     */
    function installExceptionListener(targetThread = "current") {
        const currentThread = Il2Cpp.exports.threadGetCurrent();
        return Interceptor.attach(Il2Cpp.module.getExportByName("__cxa_throw"), function (args) {
            if (targetThread == "current" && !Il2Cpp.exports.threadGetCurrent().equals(currentThread)) {
                return;
            }
            inform(new Il2Cpp.Object(args[0].readPointer()));
        });
    }
    Il2Cpp.installExceptionListener = installExceptionListener;
})(Il2Cpp || (Il2Cpp = {}));
var Il2Cpp;
(function (Il2Cpp) {
    /**
     * The **core** object where all the necessary IL2CPP native functions are
     * held. \
     * `frida-il2cpp-bridge` is built around this object by providing an
     * easy-to-use abstraction layer: the user isn't expected to use it directly,
     * but it can in case of advanced use cases.
     *
     * The exports depends on the Unity version, hence some of them may be
     * unavailable; moreover, they are searched by **name** (e.g.
     * `il2cpp_class_from_name`) hence they might get stripped, hidden or
     * renamed by a nasty obfuscator.
     *
     * However, it is possible to override or set the handle of any of the
     * exports using {@link Il2Cpp.$config.exports}:
     * ```ts
     * Il2Cpp.$config.exports = {
     *     il2cpp_image_get_class: () => Il2Cpp.module.base.add(0x1204c),
     *     il2cpp_class_get_parent: () => {
     *         return Memory.scanSync(Il2Cpp.module.base, Il2Cpp.module.size, "2f 10 ee 10 34 a8")[0].address;
     *     },
     * };
     *
     * Il2Cpp.perform(() => {
     *     // ...
     * });
     * ```
     */
    Il2Cpp.exports = {
        get alloc() {
            return r("MciyqyZUqzs", "pointer", ["size_t"]);
        },
        get arrayGetLength() {
            return r("lsJPqRstYLA", "uint32", ["pointer"]);
        },
        get arrayNew() {
            return r("aQdOKYbbBOJ", "pointer", ["pointer", "uint32"]);
        },
        get assemblyGetImage() {
            return r("pCFVwQfUQaq", "pointer", ["pointer"]);
        },
        get classForEach() {
            return r("UKUgxQg_uWi", "void", ["pointer", "pointer"]);
        },
        get classFromName() {
            return r("QSBbaDLowpv", "pointer", ["pointer", "pointer", "pointer"]);
        },
        get classFromObject() {
            return r("ye_kIUmSOEO", "pointer", ["pointer"]);
        },
        get classGetArrayClass() {
            return r("bgUobcUUpTE", "pointer", ["pointer", "uint32"]);
        },
        get classGetArrayElementSize() {
            return r("WLSlAqDvTyp", "int", ["pointer"]);
        },
        get classGetAssemblyName() {
            return r("nlqzfDOfmvD", "pointer", ["pointer"]);
        },
        get classGetBaseType() {
            return r("hqYnjwtvhPk", "pointer", ["pointer"]);
        },
        get classGetDeclaringType() {
            return r("WWKflrBBxHq", "pointer", ["pointer"]);
        },
        get classGetElementClass() {
            return r("kJAvJqHIqMF", "pointer", ["pointer"]);
        },
        get classGetFieldFromName() {
            return r("JBULiaw_kdI", "pointer", ["pointer", "pointer"]);
        },
        get classGetFields() {
            return r("eeTGKyDXMxS", "pointer", ["pointer", "pointer"]);
        },
        get classGetFlags() {
            return r("FYizmfwVeai", "int", ["pointer"]);
        },
        get classGetImage() {
            return r("ZIslaNxSXPO", "pointer", ["pointer"]);
        },
        get classGetInstanceSize() {
            return r("hyMJiPpyMKf", "int32", ["pointer"]);
        },
        get classGetInterfaces() {
            return r("FUkBlTfeNwA", "pointer", ["pointer", "pointer"]);
        },
        get classGetMethodFromName() {
            return r("RESTrUAcETG", "pointer", ["pointer", "pointer", "int"]);
        },
        get classGetMethods() {
            return r("IDwwTAKBvKD", "pointer", ["pointer", "pointer"]);
        },
        get classGetName() {
            return r("fzrvHsqLxGB", "pointer", ["pointer"]);
        },
        get classGetNamespace() {
            return r("KaYTKSEHUI_", "pointer", ["pointer"]);
        },
        get classGetNestedClasses() {
            return r("nBuNvuBcCWJ", "pointer", ["pointer", "pointer"]);
        },
        get classGetParent() {
            return r("kLexofAbldI", "pointer", ["pointer"]);
        },
        get classGetStaticFieldData() {
            return r("rftSOOp_iLQ", "pointer", ["pointer"]);
        },
        get classGetValueTypeSize() {
            return r("yGB_eoeChIo", "int32", ["pointer", "pointer"]);
        },
        get classGetType() {
            return r("VtpQbPccYvi", "pointer", ["pointer"]);
        },
        get classHasReferences() {
            return r("_SNTECrPBNY", "bool", ["pointer"]);
        },
        get classInitialize() {
            return r("iKivVFkVMqG", "void", ["pointer"]);
        },
        get classIsAbstract() {
            return r("ekNbDUfwruU", "bool", ["pointer"]);
        },
        get classIsAssignableFrom() {
            return r("hYofcHjBqGI", "bool", ["pointer", "pointer"]);
        },
        get classIsBlittable() {
            return r("xbBjTxepYgh", "bool", ["pointer"]);
        },
        get classIsEnum() {
            return r("AgNWzLhizof", "bool", ["pointer"]);
        },
        get classIsGeneric() {
            return r("JnzPPavbFjO", "bool", ["pointer"]);
        },
        get classIsInflated() {
            return r("UUdHwqVulNw", "bool", ["pointer"]);
        },
        get classIsInterface() {
            return r("afMacrJwWGT", "bool", ["pointer"]);
        },
        get classIsSubclassOf() {
            return r("s_RPDlWhWEg", "bool", ["pointer", "pointer", "bool"]);
        },
        get classIsValueType() {
            return r("FHMKhLgwoyG", "bool", ["pointer"]);
        },
        get domainGetAssemblyFromName() {
            return r("iNCjiOrfHFR", "pointer", ["pointer", "pointer"]);
        },
        get domainGet() {
            return r("UmHolsQnHNI", "pointer", []);
        },
        get domainGetAssemblies() {
            return r("aEARmkzVXdT", "pointer", ["pointer", "pointer"]);
        },
        get fieldGetClass() {
            return r("qgwGnwSQAHt", "pointer", ["pointer"]);
        },
        get fieldGetFlags() {
            return r("wQxuCUVYfYX", "int", ["pointer"]);
        },
        get fieldGetName() {
            return r("XfLxrfIJjfN", "pointer", ["pointer"]);
        },
        get fieldGetOffset() {
            return r("jLVcLPkNPNA", "int32", ["pointer"]);
        },
        get fieldGetStaticValue() {
            return r("TbAekGGzFKH", "void", ["pointer", "pointer"]);
        },
        get fieldGetType() {
            return r("cSjJuqphEXk", "pointer", ["pointer"]);
        },
        get fieldSetStaticValue() {
            return r("yMonwbWBBBQ", "void", ["pointer", "pointer"]);
        },
        get free() {
            return r("myRcHudfJNS", "void", ["pointer"]);
        },
        get gcCollect() {
            return r("JZAFkFCzVfb", "void", ["int"]);
        },
        get gcCollectALittle() {
            return r("BpGhQDp_ZjI", "void", []);
        },
        get gcDisable() {
            return r("qYqXMuRCEPu", "void", []);
        },
        get gcEnable() {
            return r("kaBgMtwmUrQ", "void", []);
        },
        get gcGetHeapSize() {
            return r("QPvWGiuRtqA", "int64", []);
        },
        get gcGetMaxTimeSlice() {
            return r("wiwAryeAseM", "int64", []);
        },
        get gcGetUsedSize() {
            return r("nnXZxiRSeaC", "int64", []);
        },
        get gcHandleGetTarget() {
            return r("QUkXQwCHNTf", "pointer", ["uint32"]);
        },
        get gcHandleFree() {
            return r("dufhjGsqOcp", "void", ["uint32"]);
        },
        get gcHandleNew() {
            return r("ZTwPytWFCDK", "uint32", ["pointer", "bool"]);
        },
        get gcHandleNewWeakRef() {
            return r("JPPzPlgOhal", "uint32", ["pointer", "bool"]);
        },
        get gcIsDisabled() {
            return r("CrrrelSrpQU", "bool", []);
        },
        get gcIsIncremental() {
            return r("eBxEzRtrAxT", "bool", []);
        },
        get gcSetMaxTimeSlice() {
            return r("ZsSwPLKwpgs", "void", ["int64"]);
        },
        get gcStartIncrementalCollection() {
            return r("GnPpkkvMhjh", "void", []);
        },
        get gcStartWorld() {
            return r("GAHEqmIhMYX", "void", []);
        },
        get gcStopWorld() {
            return r("GIZHqomOUnT", "void", []);
        },
        get getCorlib() {
            return r("uJuZvxoHyuq", "pointer", []);
        },
        get imageGetAssembly() {
            return r("CyLzdJSWoda", "pointer", ["pointer"]);
        },
        get imageGetClass() {
            return r("FMaMGKdwqOQ", "pointer", ["pointer", "uint"]);
        },
        get imageGetClassCount() {
            return r("OVAOWwmUFrU", "uint32", ["pointer"]);
        },
        get imageGetName() {
            return r("oKLZUEFbBKt", "pointer", ["pointer"]);
        },
        get initialize() {
            return r("ZuUkKkBEyuG", "void", ["pointer"]);
        },
        get livenessAllocateStruct() {
            return r("XwgOIgxqIlt", "pointer", ["pointer", "int", "pointer", "pointer", "pointer"]);
        },
        get livenessCalculationBegin() {
            return r("il2cpp_unity_liveness_calculation_begin", "pointer", ["pointer", "int", "pointer", "pointer", "pointer", "pointer"]);
        },
        get livenessCalculationEnd() {
            return r("il2cpp_unity_liveness_calculation_end", "void", ["pointer"]);
        },
        get livenessCalculationFromStatics() {
            return r("RkdPOGyjBMG", "void", ["pointer"]);
        },
        get livenessFinalize() {
            return r("GUNyxMvJjmT", "void", ["pointer"]);
        },
        get livenessFreeStruct() {
            return r("oTOKudmAATF", "void", ["pointer"]);
        },
        get memorySnapshotCapture() {
            return r("GYFErJPhnsj", "pointer", []);
        },
        get memorySnapshotFree() {
            return r("DbxkWPcQMMP", "void", ["pointer"]);
        },
        get memorySnapshotGetClasses() {
            return r("il2cpp_memory_snapshot_get_classes", "pointer", ["pointer", "pointer"]);
        },
        get memorySnapshotGetObjects() {
            return r("il2cpp_memory_snapshot_get_objects", "pointer", ["pointer", "pointer"]);
        },
        get methodGetClass() {
            return r("c_SakOklcbq", "pointer", ["pointer"]);
        },
        get methodGetFlags() {
            return r("BzWLsKsHooC", "uint32", ["pointer", "pointer"]);
        },
        get methodGetName() {
            return r("XLoNCgZSibp", "pointer", ["pointer"]);
        },
        get methodGetObject() {
            return r("nCPBoXcgcQj", "pointer", ["pointer", "pointer"]);
        },
        get methodGetParameterCount() {
            return r("GGVFO_lOojW", "uint8", ["pointer"]);
        },
        get methodGetParameterName() {
            return r("aYSRDYQRkKg", "pointer", ["pointer", "uint32"]);
        },
        get methodGetParameters() {
            return r("il2cpp_method_get_parameters", "pointer", ["pointer", "pointer"]);
        },
        get methodGetParameterType() {
            return r("zrKiEkqmTDj", "pointer", ["pointer", "uint32"]);
        },
        get methodGetReturnType() {
            return r("__UULjyqLnc", "pointer", ["pointer"]);
        },
        get methodIsGeneric() {
            return r("ocTRVkyOBPg", "bool", ["pointer"]);
        },
        get methodIsInflated() {
            return r("uQJvyusnxHO", "bool", ["pointer"]);
        },
        get methodIsInstance() {
            return r("bNMcmlgJiBA", "bool", ["pointer"]);
        },
        get monitorEnter() {
            return r("ICCdPzftavE", "void", ["pointer"]);
        },
        get monitorExit() {
            return r("sVXhHAzsjeJ", "void", ["pointer"]);
        },
        get monitorPulse() {
            return r("PqhcIyVZcsk", "void", ["pointer"]);
        },
        get monitorPulseAll() {
            return r("GsHAahFEpTP", "void", ["pointer"]);
        },
        get monitorTryEnter() {
            return r("UpGhjVuYkqZ", "bool", ["pointer", "uint32"]);
        },
        get monitorTryWait() {
            return r("jMDHBSDFlfK", "bool", ["pointer", "uint32"]);
        },
        get monitorWait() {
            return r("sGCVhQYaxWO", "void", ["pointer"]);
        },
        get objectGetClass() {
            return r("ovBZcMUxWAI", "pointer", ["pointer"]);
        },
        get objectGetVirtualMethod() {
            return r("GasyKUxhheV", "pointer", ["pointer", "pointer"]);
        },
        get objectInitialize() {
            return r("ctqVSfqaBmX", "void", ["pointer", "pointer"]);
        },
        get objectNew() {
            return r("mOhezmhpJrQ", "pointer", ["pointer"]);
        },
        get objectGetSize() {
            return r("YGXGPaEckKr", "uint32", ["pointer"]);
        },
        get objectUnbox() {
            return r("olgykHhmurA", "pointer", ["pointer"]);
        },
        get resolveInternalCall() {
            return r("NToqmSZcDah", "pointer", ["pointer"]);
        },
        get stringGetChars() {
            return r("oftGYVdyqMo", "pointer", ["pointer"]);
        },
        get stringGetLength() {
            return r("idiproNxxwa", "int32", ["pointer"]);
        },
        get stringNew() {
            return r("jxkQq_peyRQ", "pointer", ["pointer"]);
        },
        get valueTypeBox() {
            return r("RkjA_gBwNYv", "pointer", ["pointer", "pointer"]);
        },
        get threadAttach() {
            return r("tDuZYHWDTMy", "pointer", ["pointer"]);
        },
        get threadDetach() {
            return r("qpPGHUZrQdx", "void", ["pointer"]);
        },
        get threadGetAttachedThreads() {
            return r("il2cpp_thread_get_all_attached_threads", "pointer", ["pointer"]);
        },
        get threadGetCurrent() {
            return r("NXUcuHMuknS", "pointer", []);
        },
        get threadIsVm() {
            return r("XDtyJZJBPCd", "bool", ["pointer"]);
        },
        get typeEquals() {
            return r("cyYaNxjj_Wz", "bool", ["pointer", "pointer"]);
        },
        get typeGetClass() {
            return r("yvSksofMLun", "pointer", ["pointer"]);
        },
        get typeGetName() {
            return r("GKOWt_cFFVx", "pointer", ["pointer"]);
        },
        get typeGetObject() {
            return r("UlkHjhUjDqu", "pointer", ["pointer"]);
        },
        get typeGetTypeEnum() {
            return r("PbOVASwAvwv", "int", ["pointer"]);
        }
    };
    decorate(Il2Cpp.exports, lazy);
    getter(Il2Cpp, "memorySnapshotExports", () => new CModule("#include <stdint.h>\n#include <string.h>\n\ntypedef struct Il2CppManagedMemorySnapshot Il2CppManagedMemorySnapshot;\ntypedef struct Il2CppMetadataType Il2CppMetadataType;\n\nstruct Il2CppManagedMemorySnapshot\n{\n  struct Il2CppManagedHeap\n  {\n    uint32_t section_count;\n    void * sections;\n  } heap;\n  struct Il2CppStacks\n  {\n    uint32_t stack_count;\n    void * stacks;\n  } stacks;\n  struct Il2CppMetadataSnapshot\n  {\n    uint32_t type_count;\n    Il2CppMetadataType * types;\n  } metadata_snapshot;\n  struct Il2CppGCHandles\n  {\n    uint32_t tracked_object_count;\n    void ** pointers_to_objects;\n  } gc_handles;\n  struct Il2CppRuntimeInformation\n  {\n    uint32_t pointer_size;\n    uint32_t object_header_size;\n    uint32_t array_header_size;\n    uint32_t array_bounds_offset_in_header;\n    uint32_t array_size_offset_in_header;\n    uint32_t allocation_granularity;\n  } runtime_information;\n  void * additional_user_information;\n};\n\nstruct Il2CppMetadataType\n{\n  uint32_t flags;\n  void * fields;\n  uint32_t field_count;\n  uint32_t statics_size;\n  uint8_t * statics;\n  uint32_t base_or_element_type_index;\n  char * name;\n  const char * assembly_name;\n  uint64_t type_info_address;\n  uint32_t size;\n};\n\nuintptr_t\nil2cpp_memory_snapshot_get_classes (\n    const Il2CppManagedMemorySnapshot * snapshot, Il2CppMetadataType ** iter)\n{\n  const int zero = 0;\n  const void * null = 0;\n\n  if (iter != NULL && snapshot->metadata_snapshot.type_count > zero)\n  {\n    if (*iter == null)\n    {\n      *iter = snapshot->metadata_snapshot.types;\n      return (uintptr_t) (*iter)->type_info_address;\n    }\n    else\n    {\n      Il2CppMetadataType * metadata_type = *iter + 1;\n\n      if (metadata_type < snapshot->metadata_snapshot.types +\n                              snapshot->metadata_snapshot.type_count)\n      {\n        *iter = metadata_type;\n        return (uintptr_t) (*iter)->type_info_address;\n      }\n    }\n  }\n  return 0;\n}\n\nvoid **\nil2cpp_memory_snapshot_get_objects (\n    const Il2CppManagedMemorySnapshot * snapshot, uint32_t * size)\n{\n  *size = snapshot->gc_handles.tracked_object_count;\n  return snapshot->gc_handles.pointers_to_objects;\n}\n"), lazy);
    function r(exportName, retType, argTypes) {
        const handle = Il2Cpp.$config.exports?.[exportName]?.() ?? Il2Cpp.module.findExportByName(exportName) ?? Il2Cpp.memorySnapshotExports[exportName];
        const target = new NativeFunction(handle ?? NULL, retType, argTypes);
        return target.isNull()
            ? new Proxy(target, {
                get(value, name) {
                    const property = value[name];
                    return typeof property === "function" ? property.bind(value) : property;
                },
                apply() {
                    if (handle == null) {
                        raise(`couldn't resolve export ${exportName}`);
                    }
                    else if (handle.isNull()) {
                        raise(`export ${exportName} points to NULL IL2CPP library has likely been stripped, obfuscated, or customized`);
                    }
                }
            })
            : target;
    }
})(Il2Cpp || (Il2Cpp = {}));
var Il2Cpp;
(function (Il2Cpp) {
    /**
     * Creates a filter to include elements whose type can be assigned to a
     * variable of the given class. \
     * It relies on {@link Il2Cpp.Class.isAssignableFrom}.
     *
     * ```ts
     * const IComparable = Il2Cpp.corlib.class("System.IComparable");
     *
     * const objects = [
     *     Il2Cpp.corlib.class("System.Object").new(),
     *     Il2Cpp.corlib.class("System.String").new()
     * ];
     *
     * const comparables = objects.filter(Il2Cpp.is(IComparable));
     * ```
     */
    function is(klass) {
        return (element) => {
            if (element instanceof Il2Cpp.Class) {
                return klass.isAssignableFrom(element);
            }
            else {
                return klass.isAssignableFrom(element.class);
            }
        };
    }
    Il2Cpp.is = is;
    /**
     * Creates a filter to include elements whose type can be corresponds to
     * the given class. \
     * It compares the native handle of the element classes.
     *
     * ```ts
     * const String = Il2Cpp.corlib.class("System.String");
     *
     * const objects = [
     *     Il2Cpp.corlib.class("System.Object").new(),
     *     Il2Cpp.corlib.class("System.String").new()
     * ];
     *
     * const strings = objects.filter(Il2Cpp.isExactly(String));
     * ```
     */
    function isExactly(klass) {
        return (element) => {
            if (element instanceof Il2Cpp.Class) {
                return element.equals(klass);
            }
            else {
                return element.class.equals(klass);
            }
        };
    }
    Il2Cpp.isExactly = isExactly;
})(Il2Cpp || (Il2Cpp = {}));
var Il2Cpp;
(function (Il2Cpp) {
    /**
     * The object literal to interacts with the garbage collector.
     */
    Il2Cpp.gc = {
        /**
         * Gets the heap size in bytes.
         */
        get heapSize() {
            return Il2Cpp.exports.gcGetHeapSize();
        },
        /**
         * Determines whether the garbage collector is enabled.
         */
        get isEnabled() {
            return !Il2Cpp.exports.gcIsDisabled();
        },
        /**
         * Determines whether the garbage collector is incremental
         * ([source](https://docs.unity3d.com/Manual/performance-incremental-garbage-collection.html)).
         */
        get isIncremental() {
            return !!Il2Cpp.exports.gcIsIncremental();
        },
        /**
         * Gets the number of nanoseconds the garbage collector can spend in a
         * collection step.
         */
        get maxTimeSlice() {
            return Il2Cpp.exports.gcGetMaxTimeSlice();
        },
        /**
         * Gets the used heap size in bytes.
         */
        get usedHeapSize() {
            return Il2Cpp.exports.gcGetUsedSize();
        },
        /**
         * Enables or disables the garbage collector.
         */
        set isEnabled(value) {
            value ? Il2Cpp.exports.gcEnable() : Il2Cpp.exports.gcDisable();
        },
        /**
         *  Sets the number of nanoseconds the garbage collector can spend in
         * a collection step.
         */
        set maxTimeSlice(nanoseconds) {
            Il2Cpp.exports.gcSetMaxTimeSlice(nanoseconds);
        },
        /**
         * Returns the heap allocated objects of the specified class. \
         * This variant reads GC descriptors.
         */
        choose(klass) {
            const matches = [];
            const callback = (objects, size) => {
                for (let i = 0; i < size; i++) {
                    matches.push(new Il2Cpp.Object(objects.add(i * Process.pointerSize).readPointer()));
                }
            };
            const chooseCallback = new NativeCallback(callback, "void", ["pointer", "int", "pointer"]);
            if (Il2Cpp.unityVersionIsBelow202120) {
                const onWorld = new NativeCallback(() => { }, "void", []);
                const state = Il2Cpp.exports.livenessCalculationBegin(klass, 0, chooseCallback, NULL, onWorld, onWorld);
                Il2Cpp.exports.livenessCalculationFromStatics(state);
                Il2Cpp.exports.livenessCalculationEnd(state);
            }
            else {
                const realloc = (handle, size) => {
                    if (!handle.isNull() && size.compare(0) == 0) {
                        Il2Cpp.free(handle);
                        return NULL;
                    }
                    else {
                        return Il2Cpp.alloc(size);
                    }
                };
                const reallocCallback = new NativeCallback(realloc, "pointer", ["pointer", "size_t", "pointer"]);
                this.stopWorld();
                const state = Il2Cpp.exports.livenessAllocateStruct(klass, 0, chooseCallback, NULL, reallocCallback);
                Il2Cpp.exports.livenessCalculationFromStatics(state);
                Il2Cpp.exports.livenessFinalize(state);
                this.startWorld();
                Il2Cpp.exports.livenessFreeStruct(state);
            }
            return matches;
        },
        /**
         * Forces a garbage collection of the specified generation.
         */
        collect(generation) {
            Il2Cpp.exports.gcCollect(generation < 0 ? 0 : generation > 2 ? 2 : generation);
        },
        /**
         * Forces a garbage collection.
         */
        collectALittle() {
            Il2Cpp.exports.gcCollectALittle();
        },
        /**
         *  Resumes all the previously stopped threads.
         */
        startWorld() {
            return Il2Cpp.exports.gcStartWorld();
        },
        /**
         * Performs an incremental garbage collection.
         */
        startIncrementalCollection() {
            return Il2Cpp.exports.gcStartIncrementalCollection();
        },
        /**
         * Stops all threads which may access the garbage collected heap, other
         * than the caller.
         */
        stopWorld() {
            return Il2Cpp.exports.gcStopWorld();
        }
    };
})(Il2Cpp || (Il2Cpp = {}));
/** @internal */
var Android;
(function (Android) {
    // prettier-ignore
    getter(Android, "apiLevel", () => {
        const value = getProperty("ro.build.version.sdk");
        return value ? parseInt(value) : null;
    }, lazy);
    function getProperty(name) {
        const handle = Process.findModuleByName("libc.so")?.findExportByName("__system_property_get");
        if (handle) {
            const __system_property_get = new NativeFunction(handle, "void", ["pointer", "pointer"]);
            const value = Memory.alloc(92).writePointer(NULL);
            __system_property_get(Memory.allocUtf8String(name), value);
            return value.readCString() ?? undefined;
        }
    }
})(Android || (Android = {}));
/** @internal */
function raise(message) {
    const error = new Error(message);
    // in the stack message, it is only used by V8 - qjs ignores it
    error.name = "Il2CppError";
    error.stack = error.stack
        // reset style and replace "(Il2Cpp)?Error" with custom tag
        ?.replace(/^(Il2Cpp)?Error/, "\x1b[0m\x1b[38;5;9mil2cpp\x1b[0m")
        // replace the (unhelpful) first line of the stack ("at raise ...") and
        // add style to the stack lines
        ?.replace(/\n    at (.+) \((.+):(.+)\)/, "\x1b[3m\x1b[2m")
        // reset style
        ?.concat("\x1B[0m");
    throw error;
}
/** @internal */
function warn(message) {
    globalThis.console.log(`\x1b[38;5;11mil2cpp\x1b[0m: ${message}`);
}
/** @internal */
function ok(message) {
    globalThis.console.log(`\x1b[38;5;10mil2cpp\x1b[0m: ${message}`);
}
/** @internal */
function inform(message) {
    globalThis.console.log(`\x1b[38;5;12mil2cpp\x1b[0m: ${message}`);
}
/** @internal */
function decorate(target, decorator, descriptors = Object.getOwnPropertyDescriptors(target)) {
    for (const key in descriptors) {
        descriptors[key] = decorator(target, key, descriptors[key]);
    }
    Object.defineProperties(target, descriptors);
    return target;
}
/** @internal */
function getter(target, key, get, decorator) {
    globalThis.Object.defineProperty(target, key, decorator?.(target, key, { get, configurable: true }) ?? { get, configurable: true });
}
/** @internal https://stackoverflow.com/a/52171480/16885569 */
function cyrb53(str) {
    let h1 = 0xdeadbeef;
    let h2 = 0x41c6ce57;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}
/** @internal */
function exportsHash(module) {
    return cyrb53(module
        .enumerateExports()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(_ => _.name + _.address.sub(module.base))
        .join(""));
}
/** @internal */
function lazy(_, propertyKey, descriptor) {
    const getter = descriptor.get;
    if (!getter) {
        throw new Error("@lazy can only be applied to getter accessors");
    }
    descriptor.get = function () {
        const value = getter.call(this);
        Object.defineProperty(this, propertyKey, {
            value,
            configurable: descriptor.configurable,
            enumerable: descriptor.enumerable,
            writable: false
        });
        return value;
    };
    return descriptor;
}
/** Scaffold class. */
class NativeStruct {
    handle;
    constructor(handleOrWrapper) {
        if (handleOrWrapper instanceof NativePointer) {
            this.handle = handleOrWrapper;
        }
        else {
            this.handle = handleOrWrapper.handle;
        }
    }
    equals(other) {
        return this.handle.equals(other.handle);
    }
    isNull() {
        return this.handle.isNull();
    }
    asNullable() {
        return this.isNull() ? null : this;
    }
}
/** @internal */
function addFlippedEntries(obj) {
    return Object.keys(obj).reduce((obj, key) => ((obj[obj[key]] = key), obj), obj);
}
NativePointer.prototype.offsetOf = function (condition, depth) {
    depth ??= 512;
    for (let i = 0; depth > 0 ? i < depth : i < -depth; i++) {
        if (condition(depth > 0 ? this.add(i) : this.sub(i))) {
            return i;
        }
    }
    return null;
};
/** @internal */
function readNativeIterator(block) {
    const array = [];
    const iterator = Memory.alloc(Process.pointerSize);
    let handle = block(iterator);
    while (!handle.isNull()) {
        array.push(handle);
        handle = block(iterator);
    }
    return array;
}
/** @internal */
function readNativeList(block) {
    const lengthPointer = Memory.alloc(Process.pointerSize);
    const startPointer = block(lengthPointer);
    if (startPointer.isNull()) {
        return [];
    }
    const array = new Array(lengthPointer.readInt());
    for (let i = 0; i < array.length; i++) {
        array[i] = startPointer.add(i * Process.pointerSize).readPointer();
    }
    return array;
}
/** @internal */
function recycle(Class) {
    return new Proxy(Class, {
        cache: new Map(),
        construct(Target, argArray) {
            const handle = argArray[0].toUInt32();
            if (!this.cache.has(handle)) {
                this.cache.set(handle, new Target(argArray[0]));
            }
            return this.cache.get(handle);
        }
    });
}
/** @internal */
var UnityVersion;
(function (UnityVersion) {
    const pattern = /(6\d{3}|20\d{2}|\d)\.(\d)\.(\d{1,2})(?:[abcfp]|rc){0,2}\d?/;
    function find(string) {
        return string?.match(pattern)?.[0];
    }
    UnityVersion.find = find;
    function gte(a, b) {
        return compare(a, b) >= 0;
    }
    UnityVersion.gte = gte;
    function lt(a, b) {
        return compare(a, b) < 0;
    }
    UnityVersion.lt = lt;
    function compare(a, b) {
        const aMatches = a.match(pattern);
        const bMatches = b.match(pattern);
        for (let i = 1; i <= 3; i++) {
            const a = Number(aMatches?.[i] ?? -1);
            const b = Number(bMatches?.[i] ?? -1);
            if (a > b)
                return 1;
            else if (a < b)
                return -1;
        }
        return 0;
    }
})(UnityVersion || (UnityVersion = {}));
var Il2Cpp;
(function (Il2Cpp) {
    /**
     * Allocates the given amount of bytes - it's equivalent to C's `malloc`. \
     * The allocated memory should be freed manually.
     */
    function alloc(size = Process.pointerSize) {
        return Il2Cpp.exports.alloc(size);
    }
    Il2Cpp.alloc = alloc;
    /**
     * Frees a previously allocated memory using {@link Il2Cpp.alloc} - it's
     *  equivalent to C's `free`..
     *
     * ```ts
     * const handle = Il2Cpp.alloc(64);
     *
     * // ...
     *
     * Il2Cpp.free(handle);
     * ```
     */
    function free(pointer) {
        return Il2Cpp.exports.free(pointer);
    }
    Il2Cpp.free = free;
    /** @internal */
    function read(pointer, type) {
        switch (type.enumValue) {
            case Il2Cpp.Type.Enum.BOOLEAN:
                return !!pointer.readS8();
            case Il2Cpp.Type.Enum.BYTE:
                return pointer.readS8();
            case Il2Cpp.Type.Enum.UBYTE:
                return pointer.readU8();
            case Il2Cpp.Type.Enum.SHORT:
                return pointer.readS16();
            case Il2Cpp.Type.Enum.USHORT:
                return pointer.readU16();
            case Il2Cpp.Type.Enum.INT:
                return pointer.readS32();
            case Il2Cpp.Type.Enum.UINT:
                return pointer.readU32();
            case Il2Cpp.Type.Enum.CHAR:
                return pointer.readU16();
            case Il2Cpp.Type.Enum.LONG:
                return pointer.readS64();
            case Il2Cpp.Type.Enum.ULONG:
                return pointer.readU64();
            case Il2Cpp.Type.Enum.FLOAT:
                return pointer.readFloat();
            case Il2Cpp.Type.Enum.DOUBLE:
                return pointer.readDouble();
            case Il2Cpp.Type.Enum.NINT:
            case Il2Cpp.Type.Enum.NUINT:
                return pointer.readPointer();
            case Il2Cpp.Type.Enum.POINTER:
                return new Il2Cpp.Pointer(pointer.readPointer(), type.class.baseType);
            case Il2Cpp.Type.Enum.VALUE_TYPE:
                return new Il2Cpp.ValueType(pointer, type);
            case Il2Cpp.Type.Enum.OBJECT:
            case Il2Cpp.Type.Enum.CLASS:
                return new Il2Cpp.Object(pointer.readPointer());
            case Il2Cpp.Type.Enum.GENERIC_INSTANCE:
                return type.class.isValueType ? new Il2Cpp.ValueType(pointer, type) : new Il2Cpp.Object(pointer.readPointer());
            case Il2Cpp.Type.Enum.STRING:
                return new Il2Cpp.String(pointer.readPointer());
            case Il2Cpp.Type.Enum.ARRAY:
            case Il2Cpp.Type.Enum.NARRAY:
                return new Il2Cpp.Array(pointer.readPointer());
        }
        raise(`couldn't read the value from ${pointer} using an unhandled or unknown type ${type.name} (${type.enumValue}), please file an issue`);
    }
    Il2Cpp.read = read;
    /** @internal */
    function write(pointer, value, type) {
        switch (type.enumValue) {
            case Il2Cpp.Type.Enum.BOOLEAN:
                return pointer.writeS8(+value);
            case Il2Cpp.Type.Enum.BYTE:
                return pointer.writeS8(value);
            case Il2Cpp.Type.Enum.UBYTE:
                return pointer.writeU8(value);
            case Il2Cpp.Type.Enum.SHORT:
                return pointer.writeS16(value);
            case Il2Cpp.Type.Enum.USHORT:
                return pointer.writeU16(value);
            case Il2Cpp.Type.Enum.INT:
                return pointer.writeS32(value);
            case Il2Cpp.Type.Enum.UINT:
                return pointer.writeU32(value);
            case Il2Cpp.Type.Enum.CHAR:
                return pointer.writeU16(value);
            case Il2Cpp.Type.Enum.LONG:
                return pointer.writeS64(value);
            case Il2Cpp.Type.Enum.ULONG:
                return pointer.writeU64(value);
            case Il2Cpp.Type.Enum.FLOAT:
                return pointer.writeFloat(value);
            case Il2Cpp.Type.Enum.DOUBLE:
                return pointer.writeDouble(value);
            case Il2Cpp.Type.Enum.NINT:
            case Il2Cpp.Type.Enum.NUINT:
            case Il2Cpp.Type.Enum.POINTER:
            case Il2Cpp.Type.Enum.STRING:
            case Il2Cpp.Type.Enum.ARRAY:
            case Il2Cpp.Type.Enum.NARRAY:
                return pointer.writePointer(value);
            case Il2Cpp.Type.Enum.VALUE_TYPE:
                return Memory.copy(pointer, value, type.class.valueTypeSize), pointer;
            case Il2Cpp.Type.Enum.OBJECT:
            case Il2Cpp.Type.Enum.CLASS:
            case Il2Cpp.Type.Enum.GENERIC_INSTANCE:
                return value instanceof Il2Cpp.ValueType ? (Memory.copy(pointer, value, type.class.valueTypeSize), pointer) : pointer.writePointer(value);
        }
        raise(`couldn't write value ${value} to ${pointer} using an unhandled or unknown type ${type.name} (${type.enumValue}), please file an issue`);
    }
    Il2Cpp.write = write;
    /** @internal */
    function fromFridaValue(value, type) {
        if (globalThis.Array.isArray(value)) {
            const handle = Memory.alloc(type.class.valueTypeSize);
            const fields = type.class.fields.filter(_ => !_.isStatic);
            for (let i = 0; i < fields.length; i++) {
                const convertedValue = fromFridaValue(value[i], fields[i].type);
                write(handle.add(fields[i].offset).sub(Il2Cpp.Object.headerSize), convertedValue, fields[i].type);
            }
            return new Il2Cpp.ValueType(handle, type);
        }
        else if (value instanceof NativePointer) {
            if (type.isByReference) {
                return new Il2Cpp.Reference(value, type);
            }
            switch (type.enumValue) {
                case Il2Cpp.Type.Enum.POINTER:
                    return new Il2Cpp.Pointer(value, type.class.baseType);
                case Il2Cpp.Type.Enum.STRING:
                    return new Il2Cpp.String(value);
                case Il2Cpp.Type.Enum.CLASS:
                case Il2Cpp.Type.Enum.GENERIC_INSTANCE:
                case Il2Cpp.Type.Enum.OBJECT:
                    return new Il2Cpp.Object(value);
                case Il2Cpp.Type.Enum.ARRAY:
                case Il2Cpp.Type.Enum.NARRAY:
                    return new Il2Cpp.Array(value);
                default:
                    return value;
            }
        }
        else if (type.enumValue == Il2Cpp.Type.Enum.BOOLEAN) {
            return !!value;
        }
        else if (type.enumValue == Il2Cpp.Type.Enum.VALUE_TYPE && type.class.isEnum) {
            return fromFridaValue([value], type);
        }
        else {
            return value;
        }
    }
    Il2Cpp.fromFridaValue = fromFridaValue;
    /** @internal */
    function toFridaValue(value) {
        if (typeof value == "boolean") {
            return +value;
        }
        else if (value instanceof Il2Cpp.ValueType) {
            if (value.type.class.isEnum) {
                return value.field("value__").value;
            }
            else {
                const _ = value.type.class.fields.filter(_ => !_.isStatic).map(_ => toFridaValue(_.bind(value).value));
                return _.length == 0 ? [0] : _;
            }
        }
        else {
            return value;
        }
    }
    Il2Cpp.toFridaValue = toFridaValue;
})(Il2Cpp || (Il2Cpp = {}));
var Il2Cpp;
(function (Il2Cpp) {
    getter(Il2Cpp, "module", () => {
        return tryModule() ?? raise("Could not find IL2CPP module");
    });
    /**
     * @internal
     * Waits for the IL2CPP native library to be loaded and initialized.
     */
    async function initialize(blocking = false) {
        const module = tryModule() ??
            (await new Promise(resolve => {
                const [moduleName, fallbackModuleName] = getExpectedModuleNames();
                const timeout = setTimeout(() => {
                  ... (109 KB left)
