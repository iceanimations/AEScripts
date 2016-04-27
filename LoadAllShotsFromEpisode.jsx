var top_seq_folder  = 'SEQUENCES';
var top_sh_folder = 'SHOTS';
var animatic_folder = 'animatic';

var Episode = function(folder) {
    if (!folder instanceof Folder ){
        folder = Folder(folder);
    }
    this.folder = folder;
    this.name = function(){
        return this.folder.name;
    };
    this.toString = function(){
        return 'Episode( \'' + this.folder.fullName +'\' )';
    };
};

Episode.isValid = Episode.prototype.isValid = function(folder) {
    var _folder = null;

    if (this.folder === undefined){
        _folder = folder;
    }
    else {
        _folder = this.folder;
    }

    if ( _folder === null || !_folder instanceof Folder ) {
        throw new TypeError('argument should be of type Folder');
    }

    if ( _folder.exists) {
        var files = _folder.getFiles();
        for ( var i in files ){
            item = files[i];
            if (item instanceof Folder && item.name == top_seq_folder)
                return true;
        }
    }
    return false;
};

Episode.prototype.getTopSequencesFolder = function() {
    if ( this.folder.exists) {
        var files = this.folder.getFiles();
        for ( var i in files ){
            item = files[i];
            if (item instanceof Folder && item.name == top_seq_folder)
                return item;
        }
    }
};

Episode.prototype.getSequences = function () {
    var topFolder = this.getTopSequencesFolder();
    var files = topFolder.getFiles();
    var sequences = [];
    for (var f in files) {
        var item = files[f];
        if ( Sequence.isValid(item) ) {
            sequences.push( new Sequence(item) );
        }
    }
    return sequences;
};

var Sequence = function(folder) {
    if (!folder instanceof Folder)
        folder = new Folder(folder);
    this.folder = folder;
    this.name = function(){
        return this.folder.name;
    };
    this.toString = function(){
        return 'Sequence( \'' + this.folder.fullName +'\' )';
    };
};

Sequence.regexp = Sequence.prototype.regexp = new RegExp('^SQ\\d{3}$');
Sequence.prototype.getEpisode = function() {
    if ( Episode.isValid(this.folder.parent.parent) )
        return new Episode(this.folder.parent.parent);
};

Sequence.isValid = Sequence.prototype.isValid = function(folder) {
    var _folder = null;
    if (this.folder === undefined){
        _folder = folder;
    }
    else {
        _folder = this.folder;
    }

    if ( _folder === null || !_folder instanceof Folder ) {
        throw new TypeError('argument should be of type Folder');
    }

    if (!this.regexp.exec(_folder.name)){
        return false;
    }

    if ( _folder.exists) {
        var files = _folder.getFiles();
        for ( var i in files ){
            var item = files[i];
            if (item instanceof Folder && item.name == top_sh_folder)
                return true;
        }
    }
};

Sequence.prototype.getTopShotsFolder = function() {
    if ( this.folder.exists) {
        var files = this.folder.getFiles();
        for ( var i in files ){
            item = files[i];
            if (item instanceof Folder && item.name == top_sh_folder)
                return item;
        }
    }
};

Sequence.prototype.getShots = function () {
    var topFolder = this.getTopShotsFolder();
    var files = topFolder.getFiles();
    var shots = [];
    for (var f in files) {
        var item = files[f];
        if ( Shot.isValid(item) ) {
            shots.push( new Sequence(item) );
        }
    }
    return shots;
};


var Shot = function(folder){
    if (!folder instanceof Folder)
        folder = new Folder(folder);
    this.folder = folder;
    this.name = function(){
        return this.folder.name;
    };
    this.toString = function(){
        return 'Shot( \'' + this.folder.fullName +'\' )';
    };
};

Shot.regexp = Shot.prototype.regexp = new RegExp('^SQ\\d{3}_SH\\d{3}$');

Shot.prototype.getSequence = function() {
    if (Sequence.isValid(this.folder.parent.parent))
        return new Sequence(this.folder.parent.parent);
};

Shot.isValid = Shot.prototype.isValid = function(folder) {
    var _folder = null;
    if (this.folder === undefined){
        _folder = folder;
    }
    else {
        _folder = this.folder;
    }

    if ( _folder === null || !_folder instanceof Folder ) {
        throw new TypeError('argument should be of type Folder');
    }

    if (!this.regexp.exec(_folder.name)){
        return false;
    }

    if ( _folder.exists) {
        var files = _folder.getFiles();
        for ( var i in files ){
            var item = files[i];
            if (item instanceof Folder && item.name == animatic_folder)
                return true;
        }
    }
};

Shot.prototype.getAnimaticsFolder = function() {
    if ( this.folder.exists) {
        var files = this.folder.getFiles();
        for ( var i in files ){
            item = files[i];
            if (item instanceof Folder && item.name == animatic_folder)
                return item;
        }
    }
};

//var path = Folder.selectDialog ('select episode location');
var path = Folder('/P/external/Al_Mansour_Season_03/Edit/Episode_001/animatics/EP001');
if ( Episode.isValid(path) ) {
    var episode = new Episode(path);
    var seqs = episode.getSequences();
    for (var s in seqs) {
        var sequence = seqs[s];
        var shots = sequence.getShots();
        for (var sh in shots){
            $.writeln(shots[sh].name());
        }
    }
}
else
    var k = 'nothing';
