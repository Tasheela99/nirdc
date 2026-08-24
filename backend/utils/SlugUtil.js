const slugify = (text) => {
    if (!text) return Date.now().toString();
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};

const generateUniqueSlug = async (Model, title, existingId = null) => {
    let baseSlug = slugify(title);
    if (!baseSlug) {
        baseSlug = Date.now().toString();
    }
    
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (true) {
        const query = { slug: uniqueSlug };
        if (existingId) {
            query._id = { $ne: existingId };
        }
        const existingDoc = await Model.findOne(query);
        
        if (!existingDoc) {
            break;
        }
        
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
    }

    return uniqueSlug;
};

const ensureUniqueSlug = async (Model, providedSlug, existingId = null) => {
    let baseSlug = slugify(providedSlug);
    if (!baseSlug) {
        baseSlug = Date.now().toString();
    }
    
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (true) {
        const query = { slug: uniqueSlug };
        if (existingId) {
            query._id = { $ne: existingId };
        }
        const existingDoc = await Model.findOne(query);
        
        if (!existingDoc) {
            break;
        }
        
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
    }

    return uniqueSlug;
};

module.exports = {
    slugify,
    generateUniqueSlug,
    ensureUniqueSlug
};
