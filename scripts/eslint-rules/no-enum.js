/**
 * ESLint rule to detect enums and suggest converting to type + const pattern
 * This improves tree-shaking and follows the project's preferred pattern
 */

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow enum declarations in favor of type + const pattern for better tree-shaking',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      preferTypeConst:
        'Use type + const pattern instead of enum for better tree-shaking. Convert "{{enumName}}" to type union and const object.',
    },
  },

  create(context) {
    return {
      TSEnumDeclaration(node) {
        const enumName = node.id.name
        const sourceCode = context.getSourceCode()

        // Check if the enum is already exported by looking at the parent node
        const parentNode = node.parent
        const isExported =
          parentNode && parentNode.type === 'ExportNamedDeclaration'
        const exportKeyword = isExported ? 'export ' : ''

        // Get the enum members
        const members = node.members.map((member) => {
          const key = member.id.name
          const value = member.initializer
            ? sourceCode.getText(member.initializer)
            : `'${key}'`
          return { key, value }
        })

        // Generate the suggested replacement
        const typeValues = members.map((m) => m.value).join(' | ')
        const constMembers = members
          .map((m) => `  ${m.key}: ${m.value}`)
          .join(',\n')

        const suggestedCode = `${exportKeyword}type ${enumName} = ${typeValues}

${exportKeyword}const ${enumName} = {
${constMembers},
} as const`

        context.report({
          node,
          messageId: 'preferTypeConst',
          data: { enumName },
          fix(fixer) {
            return fixer.replaceText(isExported ? parentNode : node, suggestedCode)
          },
        })
      },
    }
  },
}
