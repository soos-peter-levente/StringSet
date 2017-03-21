///////////////////////////////////////////////////////////////////////////
// This program is free software: you can redistribute it and/or modify  //
// it under the terms of the GNU General Public License as published by  //
// the Free Software Foundation, either version 3 of the License, or     //
// (at your option) any later version.                                   //
//                                                                       //
// This program is distributed in the hope that it will be useful,       //
// but WITHOUT ANY WARRANTY; without even the implied warranty of        //
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the         //
// GNU General Public License for more details.                          //
//                                                                       //
// You should have received a copy of the GNU General Public License     //
// along with this program.  If not, see <http://www.gnu.org/licenses/>. //
//                                                                       //
// Copyright 2016, Soós Péter Levente                                    //
///////////////////////////////////////////////////////////////////////////

// Fun with ES6

class StringSet {
    constructor(initarg) { 
        this.set = {}; initarg ? this.add(initarg) : {}; 

        if (!this.hasOwnProperty('length')){
            Object.defineProperty(this, 'length', {
                writable: true, 
                value: 0
            })
        } 
    }

    contains(string) {
        return (this.set[string]) ? true : false ;
    }
    
    // yay, opcodes :)
    add(blob)    { this.execute(blob, "add", this) }

    remove(blob) { this.execute(blob, "rmv", this) }

    empty ()     { this.set = {}; }

    execute(blob, op, top) {
        let type;
        if (typeof blob === 'string'){
            type = "String";
        } else if (Array.isArray(blob)) { 
            type = "Array";
        } else if (blob instanceof StringSet) {
            type = "StringSet";
        } else {
            throw new TypeError("Invalid blob type: " + typeof blob)
        }

        switch (op){
        case "add": top["_" + op + type].call(this, blob); break;
        case "rmv": top["_" + op + type].call(this, blob); break;
        }
        this._setLength();
    }
    
    // define all datastruct methods in terms of the string operation.
    _addString (string) {
        this.set[string] = true;
    }
    _addArray(array){
        this._applyToArray(this._addString.bind(this), array)
    }
    _addStringSet(stringSet){
        this._applyToStringSet(this._addString.bind(this), stringSet)
    }

    _rmvString(string){
        delete this.set[string]
    }
    _rmvArray(array){
        this._applyToArray(this._rmvString.bind(this), array)
    }
    _rmvStringSet(stringSet){
        this._applyToStringSet(this._rmvString.bind(this), stringSet)
    }
    
    _applyToArray(fnc, array){
        let l = array.length;
        for (let i = 0; i < l; i++){
            let element = array[i];
            if (typeof element === 'string'){
                fnc.call(this, element)
            } else if (element instanceof StringSet || Array.isArray(string)){
                this.add(element); // because we can.
            }
        }        
    }

    _applyToStringSet(fnc, stringset){
        for (let string in stringset.set){
            fnc.call(this, string);
        }
    }

    // HELPERS & SET OPERATIONS from MDN 
    array(){
        let arr = [];
        for (let key in this.set){
            arr.push(key);
        }
        return arr;
    }

    isSupersetOf(set){
        this._isArgStringSet(set)
        let isSuperset = true;
        for (let e in set.set){
            if (!this.contains(e)) {
                isSuperset = false;
            }
        }
        return isSuperset;
    }

    union(set) {
        this._isArgStringSet(set)
        let union = new StringSet(this);
        for (let e in set.set){
            if (this.contains(e)){
                union.add(e)
            }
        }
        union._setLength();
        return union;
    }

    intersection(set) {
        this._isArgStringSet(set)
        let intersection = new StringSet();
        for (let e in set.set){
            if (this.contains(e)){
                intersection.add(e)
            }
        }
        intersection._setLength();
        return intersection;
    }

    difference(set) {        
        this._isArgStringSet(set)
        let difference = new StringSet(this);
        for (let e in set.set) {
            difference.remove(e);
        }
        difference._setLength();
        return difference;
    }

    _setLength(){
        this.length = Object.keys(this.set).length;
    }

    _isArgStringSet(arg){
        if (arg instanceof StringSet){
            return true;
        } else {
            throw new TypeError("Set operation expects StringSet object.")
        } 
    }
}

if (typeof module.exports !== 'undefined'){
    module.exports = StringSet;
}
