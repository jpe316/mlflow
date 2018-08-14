export class ArtifactNode {
  constructor(isRoot, fileInfo, children) {
    this.isRoot = isRoot;
    this.isLoaded = false;
    // fileInfo should not be defined for the root node.
    this.fileInfo = fileInfo;
    // map of basename to ArtifactNode
    this.children = children;
  }

  deepCopy() {
    let node = new ArtifactNode(this.isRoot, this.fileInfo, undefined);
    node.isLoaded = this.isLoaded;
    if (this.children) {
      const copiedChildren = {};
      Object.keys(this.children).forEach((name) => {
        copiedChildren[name] = this.children[name].deepCopy();
      });
      node.children = copiedChildren;
    }
    return node;
  }

  static setChildren(node, fileInfos) {
    if (fileInfos) {
      node.children = {};
      node.isLoaded = true;
      fileInfos.forEach((fileInfo) => {
        // basename is the last part of the path for this fileInfo.
        const pathParts = fileInfo.path.split("/");
        const basename = pathParts[pathParts.length - 1];
        let children;
        if (fileInfo.is_dir) {
          children = [];
        }
        node.children[basename] = new ArtifactNode(false, fileInfo, children);
      });
    } else {
      node.isLoaded = true;
    }
  }

  static findChild(node, path) {
    const parts = path.split('/');
    let ret = node;
    parts.forEach((part) => {
      if (ret.children && ret.children[part] !== undefined) {
        ret = ret.children[part];
      } else {
        throw new Error("Can't find child.");
      }
    });
    return ret;
  }

  static isEmpty(node) {
    return node.children === undefined || Object.keys(node.children).length === 0;
  }
}