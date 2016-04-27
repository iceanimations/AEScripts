var top_seq_folder  = 'SEQUENCES';
var top_sh_folder = 'SHOTS';
var animatic_folder = 'animatic';

var elementConstructor = function (obj, folder) {
    if (!folder instanceof Folder ){
        folder = Folder(folder);
    }
    obj.folder = folder;
    obj.name = function(){
        return obj.folder.name;
    };
    obj.toString = function(){
        return obj.type + ' ( \'' + obj.folder.fullName +'\' )';
    };
};

var checkValidity = function (obj, folder, subfolder_name, regexp) {
    var _folder = null;

    if (obj.folder === undefined){
        _folder = folder;
    }
    else {
        _folder = obj.folder;
    }

    if ( _folder === null || !_folder instanceof Folder ) {
        throw new TypeError('argument should be of type Folder');
    }

    if (regexp instanceof RegExp){
        if (!regexp.exec(_folder.name)){
            return false;
        }
    }

    if ( _folder.exists) {
        subfolder = false;
        var files = _folder.getFiles();
        for ( var i in files ){
            item = files[i];
            if (item instanceof Folder && item.name == subfolder_name)
                subfolder = true;
        }
        if (!subfolder)
            return false;
    }
    return true;
};

var getSubFolder = function (folder, subfolder_name) {
    if ( folder.exists) {
        var files = folder.getFiles();
        for ( var i in files ){
            item = files[i];
            if (item instanceof Folder && item.name == subfolder_name)
                return item;
        }
    }
};

var getChildren = function(topFolder, type) {
    var files = topFolder.getFiles();
    var sequences = [];
    for (var f in files) {
        var item = files[f];
        if ( type.isValid(item) ) {
            sequences.push( new type(item) );
        }
    }
    return sequences;
};

var Episode = function(folder) {
    this.type = 'Episode';
    elementConstructor(this, folder);
    this.getTopSequencesFolder =  function() {
        return getSubFolder(this.folder, top_seq_folder);
    };
    this.getSequences = function () {
        var topFolder = this.getTopSequencesFolder();
        return getChildren(topFolder, Sequence);
    };
};
Episode.isValid = Episode.prototype.isValid = function(folder) {
    return checkValidity(this, folder, top_seq_folder);
};

var Sequence = function(folder) {
    this.type = 'Sequence';
    elementConstructor(this, folder);
    this.getEpisode = function() {
        if ( Episode.isValid(this.folder.parent.parent) )
            return new Episode(this.folder.parent.parent);
    };
    this.getTopShotsFolder = function() {
        return getSubFolder(this.folder, top_sh_folder);
    };
    Sequence.prototype.getShots = function () {
        var topFolder = this.getTopShotsFolder();
        return getChildren(topFolder, Shot);
    };
};
Sequence.isValid = Sequence.prototype.isValid = function(folder) {
    return checkValidity(this, folder, top_sh_folder, Sequence.regexp);
};
Sequence.regexp = Sequence.prototype.regexp = new RegExp('^SQ\\d{3}$');

var Shot = function(folder){
    this.type = 'Sequence';
    elementConstructor(this, folder);
    this.getSequence = function() {
        if (Sequence.isValid(this.folder.parent.parent))
            return new Sequence(this.folder.parent.parent);
    };
    this.getAnimaticsFolder = function() {
        return getSubFolder(this.folder, animatic_folder);
    };
};
Shot.isValid = Shot.prototype.isValid = function(folder) {
    return checkValidity(this, folder, animatic_folder, Shot.regexp);
};
Shot.regexp = Shot.prototype.regexp = new RegExp('^SQ\\d{3}_SH\\d{3}$');

var detectElement = function(folder) {
    if ( Episode.isValid(folder) )
        return new Episode(folder);
    else if ( Sequence.isValid(folder) )
        return new Sequence(folder);
    else if ( Shot.isValid(folder) )
        return new Shot(folder);
};

var testElements = function () {
    var path = Folder('/P/external/Al_Mansour_Season_03/Edit/Episode_001/animatics/EP001');
    if ( Episode.isValid(path) ) {
        var episode = detectElement(path);
        var seqs = episode.getSequences();
        for (var s in seqs) {
            var sequence = seqs[s];
            var shots = sequence.getShots();
            for (var sh in shots){
                $.writeln(shots[sh].name());
            }
        }
    }
};

//var path = Folder.selectDialog ('select episode location');
//
testElements();

var importAnimaticFromEpisode = function() {

};

