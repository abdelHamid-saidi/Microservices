import {Filter, repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {Book} from '../models';
import {BookRepository} from '../repositories';
import {publishMessage} from '../services/rabbitmq.publisher';

export class BookController {
  constructor(
    @repository(BookRepository)
    public bookRepository: BookRepository,
  ) {}

  @post('/books')
  @response(200, {
    description: 'Book model instance',
    content: {'application/json': {schema: getModelSchemaRef(Book)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Book, {
            title: 'NewBook',
            exclude: ['id'],
          }),
        },
      },
    })
    book: Omit<Book, 'id'>,
  ): Promise<Book> {
    return this.bookRepository.create(book);
  }

  @get('/books')
  @response(200, {
    description: 'Array of Book model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Book, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Book) filter?: Filter<Book>): Promise<Book[]> {
    return this.bookRepository.find(filter);
  }

  @del('/books/{id}')
  @response(204, {
    description: 'Book DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    const book = await this.bookRepository.findById(id);
    await this.bookRepository.deleteById(id);
    await publishMessage('inventory.deleted', {
      event: 'inventory.deleted',
      id: book.id,
      title: book.title,
      author: book.author,
    });
  }

  @del('/inventory/{id}')
  @response(204, {
    description: 'Inventory item DELETE success',
  })
  async deleteInventory(@param.path.string('id') id: string): Promise<void> {
    await this.deleteById(id);
  }
}
