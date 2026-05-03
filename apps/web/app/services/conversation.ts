import { prisma } from '@bpjs/database'

// DTOs
export interface CreateConversationDTO {
  chatId: string;
  userName: string;
  message: string;
  category?: string;
}

// Repository Interface
interface IConversationRepository {
  create(data: CreateConversationDTO): Promise<any>;
  findAll(limit?: number): Promise<any[]>;
  findByChatId(chatId: string): Promise<any[]>;
  updateResponse(id: string, response: string): Promise<any>;
}

// Implementation
export class ConversationRepository {
  async create(data: CreateConversationDTO) {
    return await prisma.conversation.create({
      data: {
        ...data,
        status: 'active'
      }
    })
  }

  async findAll(limit = 50) {
    return await prisma.conversation.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit
    })
  }

  async findById(id: string) {
    return await prisma.conversation.findUnique({
      where: { id }
    })
  }

  async findByChatId(chatId: string) {
    return await prisma.conversation.findMany({
      where: { chatId },
      orderBy: { createdAt: 'desc' }
    })
  }

  async updateResponse(id: string, response: string) {
    return await prisma.conversation.update({
      where: { id },
      data: { 
        response,
        status: 'resolved'
      }
    })
  }
}

// Singleton export
export const conversationRepo = new ConversationRepository();